import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL'
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { fetchedCategories, fetchingCategories } from '../../redux/categoriesSlice';
import { fetchingProducts, addProduct, updateProduct } from '../../redux/productsSlice';
import Dragger from 'antd/lib/upload/Dragger';
import UpdateContent from './UpdateContent';

import ReactToPrint from 'react-to-print';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useTranslation } from 'react-i18next';

import swal from 'sweetalert';

const Content = ({ refresh,  setRefresh, type, currentProduct, setOpen, USD_RATE, currency_date, qr_code_link }) => {
  const { categories } = useSelector(state => state.categoriesReducer)
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState()
  const [currentRate, setCurrentRate] = useState(0)
  const [priceInUZS, setPriceInUZS] = useState(0)
  const [currentWhosale, setCurrentWhosale] = useState()
  const [USD, setUSD] = useState()
  const [fileUploaded, setFileUploaded] = useState(false)
  const componentRef = useRef();
  const {t} = useTranslation()

  const [photoUploaded, setPhotoUploaded] = useState('default')

    const [product, setProduct] = useState({
      category_id: null,
      name: "",
      brand: "",
      image: '',
      cost_price:{
          currency_id: 1,
          price: null
      },
      price_min:{
          currency_id: 1,
          price: null
      },
      price_max:{
          currency_id: 1,
          price: null
      },
      price_wholesale:{
          currency_id: 1,
          price: null
      },
      warehouse: {
        unit_id: 1,
        count: null
    }
  })
 
 

  const unit_id_options = [
    {id: 1, label: t('dona')},
    {id: 2, label: t('tonna')},
    {id: 3, label: t('kilogram')},
    {id: 4, label: t('gramm')},
    {id: 5, label: t('meter')},
    {id: 6, label: t('sm')},
    {id: 7, label: t('liter')},
  ]
 

  // fetching categories
  useEffect(async () => {
    dispatch(fetchingCategories())

    const res = await axios.get(`${URL}/api/categories`, setToken());

    if (res.status === 200) {
        dispatch(fetchedCategories(res.data.payload))
    } else {
        alert('error')
    }

    const res2 = await axios.get(`${URL}/api/currency`, setToken());

    if (res2.status === 200) {
      setCurrency(res2.data.payload)
      setUSD(res2.data.payload[1].rate[0].rate)
    }
    
  }, [])
  
  
  
  const handleCurrency = (e) => {
    const USD_VALUTE = currency.filter(item => item.code === 'USD')[0]
    setProduct(prev => ({...product, cost_price: {...prev.cost_price, price: e}}))
    if (product.cost_price.currency_id === USD_VALUTE.id){
      const currentRate = currency[product.cost_price.currency_id - 1].rate[0].rate
      setPriceInUZS((e * currentRate))
    } else {
      setPriceInUZS(Math.floor(e))
    }
  }


  console.info(categories)

  
  
  useEffect(() => {
    if (product.category_id !== null) {
      const currentCategory = categories?.filter(item => item.id === product.category_id)[0] 
    
    console.info(currentCategory)
      if (categories && categories.length > 0){
        if (product.price_wholesale.currency_id === 2) {
          setProduct(prev => (
            {...product, 
              price_wholesale: {...prev.price_wholesale, 
                price: ((priceInUZS / USD) * currentCategory?.whole_percent / 100) + (priceInUZS / USD)},
              price_max: {...prev.price_max, 
                price: (priceInUZS * currentCategory.max_percent / 100) + priceInUZS},
              price_min: {...prev.price_min,
                price: (priceInUZS * currentCategory.min_percent / 100) + priceInUZS}, 
            }))
        } else {
          setProduct(prev => (
            {...product, 
              price_wholesale: {...prev.price_wholesale, 
                price: (priceInUZS * currentCategory?.whole_percent / 100) + priceInUZS},
              price_max: {...prev.price_max, 
                price: (priceInUZS * currentCategory.max_percent / 100) + priceInUZS},
              price_min: {...prev.price_min,
                price: (priceInUZS * currentCategory.min_percent / 100) + priceInUZS}, 
            }))
        }
  
        console.warn(USD);
  
        setCurrentWhosale((priceInUZS * currentCategory?.whole_percent / 100) + priceInUZS)
        setCurrentRate(currency && currency[product.cost_price.currency_id - 1].rate.length ? currency[product.cost_price.currency_id - 1].rate[0].rate : 0)
      
      }
    }

  } , [product.cost_price, product.category_id, product.cost_price.currency_id])


  const saveProductFunc = () => {
    if (product.brand !== "" && product.category_id !== null && product.name !== null){
      dispatch(fetchingProducts())

      axios.post(`${URL}/api/product`, product , setToken())
      .then(res => {
        swal({
          title: t('muaffaqiyatli'),
          icon: 'success'
        })

        setRefresh(!refresh)

        setOpen(false)

        setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: null}}))
        setProduct(prev => ({...product, price_max: {...prev.price_max, price: null}}))
        setProduct(prev => ({...product, price_min: {...prev.price_min, price: null}}))
        setCurrentWhosale(0)
        setPriceInUZS(0)
        setProduct(prev => ({...product, warehouse: {...prev.warehouse, count: null}}))

        setProduct({
          category_id: null,
          name: "",
          brand: "",
          image: '',
          cost_price:{
              currency_id: 1,
              price: null
          },
          price_min:{
              currency_id: 1,
              price: null
          },
          price_max:{
              currency_id: 1,
              price: null
          },
          price_wholesale:{
              currency_id: 1,
              price: null
          },
          warehouse: {
            unit_id: 1,
            count: null
        }
      })


      
      }) 
      .catch(res => {
        swal({
          title: t('xatolik'),
          icon: 'error'
        })

      })
 
    } else {
      swal({
        title: t('malumotni_toliq_kiriting'),
        icon: 'warning'
      })
    }

  }
 

  const handleSubmit = (e) => { 
    saveProductFunc()
  }

  console.info(product)
 


  if (type === 'update') {
    return <UpdateContent USD_RATE={USD_RATE} currency_date={currency_date} type={type} currentProduct={currentProduct} setOpen={() => setOpen()} />
  }


  if (type === 'print') {
    return (
      <>
        <iframe  ref={componentRef} width="280" height="280" className="qr_code_frame" src={qr_code_link} title="Bu yerda mahsulotning qr kodi bolishi kerak edi!">

        </iframe>


        <div className="product__qr__code__content">
          <Input.Group compact>
          <ReactToPrint
            trigger={() => <Button className="btn btn-primary"style={{width: '100%',}}><i className='bx bx-printer'></i> {t('print')}</Button>}
            content={() => componentRef.current}
          />
          </Input.Group>

        </div>
      </>
    )
  }
  console.warn(qr_code_link)

  const photoUploader = (e) => {
    setPhotoUploaded('loading')
    
    const formData = new FormData()
    formData.append('file', e.file.originFileObj)
    formData.append('upload_preset', "smart-shop")


    axios.post("https://api.cloudinary.com/v1_1/http-electro-life-texnopos-site/image/upload", formData).then(res => {
      setProduct(prev => ({...product, image: res.data.secure_url}))
      setPhotoUploaded('ok')
    })
  } 

  const formData = new FormData()

  const importFile = (e) => {
    formData.append('file', e.file.originFileObj);
    setFileUploaded(true)
  }


  const sendImportFile = () => { 
      axios.post(`${URL}/api/products/import`, formData, setToken())
    .then(res => {
      setOpen(false)
      swal({
        title: t('muaffaqiyatli'),
        icon: 'success'
      }) 
    }) 
  }

  if (type === 'import'){
    return (
      <>
        <Dragger className="photo__uploader" onChange={importFile} showUploadList={false}>
                  {!fileUploaded ? (
                    <>
                      <i className='bx bx-cloud-upload ant-upload-drag-icon'></i>
                  <h4>{t('faylni_yuklang')}</h4>
                  <p>{t('faylni_yuklang_text')}</p>
                    </>
                  ) : (
                    <>
                      <i className='bx bx-check-circle success-icon'></i>
                      <h4>{t('fayl_yuklandi')}</h4>
                    </>
                  )}
            </Dragger>
            <Button disabled={!fileUploaded} onClick={sendImportFile} className='btn btn-primary' style={{width: '100%', margin: '1rem 0'}}>{t('import')}</Button>
      </> 
    )
  }

  return (
    <div className={`product__form ${product.category_id !== null && 'active'}`}>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item className="form__item" label={t('kategoriya_tanlash')} required>
          <Select placeholder={t('kategoriya_tanlash')} required value={product.category_id} onChange={e => setProduct({...product, category_id: e})} className="form__input">
            {
              categories?.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item className="form__item" label={t('brend_nomini_tanlang')}>
          <Input
            placeholder={t('brend_nomini_tanlang')}
            value={product.brand}
            onChange={e => {
              setProduct({...product, brand: e.target.value})
            }}
            className="form__input"
          />
        </Form.Item>

        <Form.Item className="form__item" label={t('mahsulot_nomini_tanlang')} required>
          <Input 
            required
            placeholder={t('mahsulot_nomini_tanlang')}
            value={product.name}
            onChange={e => {setProduct({...product, name: e.target.value})}}
            className="form__input"
          />
        </Form.Item>

        <Form.Item className="form__item" label={t('cost_price')} required>
        <Input.Group compact label={t('cost_price')} required className='form-group'>
          <div className="form-group__item">
          <InputNumber 
            required
            placeholder={t('cost_price')}
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={handleCurrency}
            value={product.cost_price.price}
          />
          </div>
          <div className="form-group__min-item">
          <Select className="form__input form__select"  value={product.cost_price.currency_id} onChange={e => setProduct(prev => ({...product, cost_price: {...prev.cost_price, currency_id: e}}))} required>
            {
              currency?.map(item => (
                <Select.Option value={item.id}>{item.code}</Select.Option>
              ))
            }
          </Select>
          </div>
        </Input.Group>
        </Form.Item>

        <Form.Item className="form__item" label={t('whole_price')} required> 
        <Input.Group compact label={t('whole_price')} required className='form-group'>
          <div className="form-group__item">
          <InputNumber 
            required
            placeholder={t('whole_price')}
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => {
              setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: e}}))
            }}
            value={product.price_wholesale.price}
          />
          </div>
          <div className="form-group__min-item ">
          <Select className="form__select form__input"  value={product.price_wholesale.currency_id} required onChange={e => {
            setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, currency_id: e}}))
            if (e === 2) {
              setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: (Math.round((currentWhosale / USD) * 100) / 100)}}))
            } else {
              setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: currentWhosale}}))
            }
          }}
           >
            {
              currency?.map(item => (
                <Select.Option value={item.id}>{item.code}</Select.Option>
              ))
            }
          </Select>
          </div>
        </Input.Group>
        </Form.Item>

        <Form.Item className="form__item" label={t('min_price')} required>
        <InputNumber 
          required
            placeholder={t('min_price')}
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => setProduct(prev => ({...product, price_min: {...prev.price_min, price: e}}))}
            value={product.price_min.price}
          />
        </Form.Item>

        <Form.Item className="form__item" label={t('max_price')} required>
        <InputNumber 
            placeholder={t('max_price')}
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => setProduct(prev => ({...product, price_max: {...prev.price_max, price: e}}))}
            value={product.price_max.price}
            required
          />
        </Form.Item>
 

        {
          type === 'add' && (
            <Form.Item className="form__item" label={t('count')} required>
        <Input.Group compact label={t('count')} required className='form-group'>
          <div className="form-group__item">
          <InputNumber 
            placeholder={t('count')}
            className={"form__input"}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => setProduct(prev => ({...product, warehouse: {...prev.warehouse, count: e}}))}
            value={product.warehouse.count}
            required
          />
          </div>
          <div className="form-group__min-item">
          <Select className="form__select form__input"  value={product.warehouse.unit_id} onChange={e => setProduct(prev => ({...product, warehouse: {...prev.cost_price, unit_id: e}}))} required>
            {
              unit_id_options?.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
              ))
            }
          </Select>
          </div>
        </Input.Group>
        </Form.Item>
          )
        } 
            <Dragger className="photo__uploader" onChange={photoUploader} showUploadList={false}>
                  {photoUploaded === 'default' ? (
                    <>
                      <i className='bx bx-cloud-upload ant-upload-drag-icon'></i>
                  <h4>{t('rasm_yuklang')}</h4>
                  <p>{t('rasimni_tanlash_text')}</p>
                    </>
                  ) : photoUploaded === 'ok' ? (
                    <>
                      <i className='bx bx-check-circle success-icon'></i>
                      <h4>{t('muaffaqiyatli')}</h4>
                    </>
                  ) : photoUploaded === 'loading' && (
                    <>
                      <i className='bx bx-time-five ant-upload-drag-icon'></i>
                      <h4>{t('kuting')}</h4>
                    </>
                  )}
            </Dragger> 
        <br />

        <Button className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center'}} htmlType="submit">{t('save')}</Button>
        
      </Form>
    </div>
  )
}

export default Content
