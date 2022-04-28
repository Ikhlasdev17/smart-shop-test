import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL'
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { fetchedCategories, fetchingCategories } from '../../redux/categoriesSlice';
import { fetchingProducts, addProduct, updateProduct } from '../../redux/productsSlice';
import Dragger from 'antd/lib/upload/Dragger';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';
const UpdateContent = ({ type, currentProduct, setOpen, USD_RATE, currency_date }) => {
  const { categories } = useSelector(state => state.categoriesReducer)
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState(currency_date)
  const [currentRate, setCurrentRate] = useState(USD_RATE)
  const [priceInUZS, setPriceInUZS] = useState(0)
  const [currentWhosale, setCurrentWhosale] = useState()
  const [USD, setUSD] = useState(USD_RATE)


  const [max_price, setMaxPrice] = useState(0)
  const [max_price_code, setMaxPrice_code] = useState()

  const [min_price, setMinPrice] = useState(0)
  const [min_price_code, setMinPrice_code] = useState()

  const [whole_price, setWholePrice] = useState(0)
  const [whole_price_code, setWholePrice_code] = useState()

  const [currentWhole, setCurrentWhole] = useState()

  const [costPriceCode, setCostPriceCode] = useState()

  const [uploaded, setUploaded] = useState('')

  const [imageUploading, setImageUploading] = useState(false)

  const {t} = useTranslation()

  const [product, setProduct] = useState({
    product_id: currentProduct?.id,
    category_id: currentProduct?.category.id,
    name: currentProduct?.name,
    brand: currentProduct?.brand,
    image: currentProduct?.image,
    cost_price:{
        currency_id: currency?.filter(item => item.code === currentProduct?.cost_price.code)[0].id,
        price: currentProduct?.cost_price.price
    },
    price_min:{
        currency_id: currency?.filter(item => item.code === currentProduct?.min_price.code)[0].id,
        price: currentProduct?.min_price.price
    },
    price_max:{
        currency_id: currency?.filter(item => item.code === currentProduct?.max_price.code)[0].id,
        price: currentProduct?.max_price.price
    },
    price_wholesale:{
            currency_id: currency?.filter(item => item.code === currentProduct?.whole_price.code)[0].id,
            price: currentProduct?.whole_price.price
        }
        })  


        useEffect(() =>{
        setProduct({
        product_id: currentProduct?.id,
        category_id: currentProduct?.category.id,
        name: currentProduct?.name,
        image: currentProduct?.image,
        brand: currentProduct?.brand,
        price_min:{
          currency_id: currency?.filter(item => item.code === currentProduct?.min_price.code)[0].id,
          price: currentProduct.min_price.price
         },
        cost_price:{
            currency_id: currency?.filter(item => item.code === currentProduct?.cost_price.code)[0].id,
            price: currentProduct?.cost_price.price
        },
        price_max:{
            currency_id: currency?.filter(item => item.code === currentProduct?.max_price.code)[0].id,
            price: currentProduct.max_price.price
        },
        price_wholesale:{
                currency_id: currency?.filter(item => item.code === currentProduct?.whole_price.code)[0].id,
                price: currentProduct.whole_price.price
            }
            })


        setMaxPrice(currentProduct.max_price.price)
        setMaxPrice_code(currency?.filter(item => item.code === currentProduct?.max_price.code)[0].id || 1)

        setMinPrice(currentProduct.min_price.price)
        setMinPrice_code(currency?.filter(item => item.code === currentProduct?.min_price.code)[0].id || 1)

        setWholePrice(currentProduct.whole_price.price)
        setCurrentWhole(currentProduct.whole_price.price)
        setWholePrice_code(currency?.filter(item => item.code === currentProduct?.whole_price.code)[0].id || 1)

        setCostPriceCode(currency?.filter(item => item.code === currentProduct?.cost_price.code)[0].id )


    } ,[currency, currentProduct, currentProduct.max_price.price, currentProduct.max_price.code ])



    
      useEffect(() => {
        if (max_price !== null && min_price !== null && whole_price !== null && min_price_code !== null && max_price_code !== null && whole_price_code !== null) {
          setProduct({
            product_id: currentProduct?.id,
            category_id: currentProduct?.category.id,
            name: currentProduct?.name,
            brand: currentProduct?.brand,
            cost_price:{
              currency_id: costPriceCode,
              price: currentProduct?.cost_price.price
            },
            price_min:{
                currency_id: min_price_code,
                price: min_price
            },
            price_max:{
                currency_id: max_price_code,
                price: max_price
            },
            price_wholesale:{
                    currency_id: whole_price_code,
                    price: whole_price
                }
                })
        }
      }, [min_price_code, min_price, max_price])

  
  // fetching categories
  useEffect(async () => {
    dispatch(fetchingCategories())

    setPriceInUZS(currentProduct?.cost_price.price)

    const res = await axios.get(`${URL}/api/categories`, setToken());

    if (res.status === 200) {
        dispatch(fetchedCategories(res.data.payload))
    } else {
        // dispatch(fetchingErrorCategories())
        console.info('err')
    }

    
    
  }, [])
  
  
  
  const handleCurrency = (e) => {
    const currentCategory = categories.filter(item => item.id === product.category_id)[0]  
      setCurrentWhosale(((priceInUZS / currentRate) * currentCategory.whole_percent / 100) + (priceInUZS / currentRate))
     
    setCurrentRate(currency && currency[product.cost_price.currency_id - 1]?.rate.length ? currency[product.cost_price.currency_id - 1].rate[0].rate : 0)
    const USD_VALUTE = currency?.filter(item => item.code === 'USD')[0]
    setProduct(prev => ({...product, cost_price: {...prev.cost_price, price: e}}))
    if (product.cost_price.currency_id === USD_VALUTE.id){
      const currentRate = currency[product.cost_price.currency_id - 1].rate[0].rate
      const val = (e * currentRate)

      setPriceInUZS(val)
      setMinPrice((val * currentCategory.min_percent / 100) + val)
      setMaxPrice((val * currentCategory.max_percent / 100) + val)
      
      if (whole_price_code === 2){ 
        setWholePrice((e * currentCategory.whole_percent / 100) + e) 
        setCurrentWhole((e * currentCategory.whole_percent / 100) + e)
      } else {
        setCurrentWhole(((val) * currentCategory.whole_percent / 100) + (val))
        setWholePrice(((val) * currentCategory.whole_percent / 100) + (val))
      }
      
    } else {
      if (whole_price_code === 2){ 
        setCurrentWhole(Math.round(((e / USD_RATE) * currentCategory.whole_percent / 100) + (e / USD_RATE) * 100) / 100)
        setWholePrice(Math.round(((e / USD_RATE) * currentCategory.whole_percent / 100) + (e / USD_RATE) * 100) / 100)
      } else {
        setWholePrice((e * currentCategory.whole_percent / 100) + e) 
        setCurrentWhole((e * currentCategory.whole_percent / 100) + e)
      }
      setPriceInUZS(Math.floor(e))

      setMinPrice((e * currentCategory.min_percent / 100) + e)
      setMaxPrice((e * currentCategory.max_percent / 100) + e)
      
      
     
    }

  }  


  useEffect(() => {
    const currentCategory = categories.filter(item => item.id === product.category_id)[0] 
    


      if (whole_price_code === 2) {
        setProduct(prev => (
          {...product, 
            price_wholesale: {...prev.price_wholesale, 
              price: ((priceInUZS / currentRate) * currentCategory.whole_percent / 100) + (priceInUZS / currentRate)},
            price_max: {...prev.price_max, 
              price: (priceInUZS * currentCategory.max_percent / 100) + priceInUZS},
            price_min: {...prev.price_min,
              price: (priceInUZS * currentCategory.min_percent / 100) + priceInUZS}, 
            
          }))
          setCurrentWhosale(((priceInUZS / currentRate) * currentCategory.whole_percent / 100) + (priceInUZS / currentRate))
      } else {
        setProduct(prev => (
          {...product, 
            price_wholesale: {...prev.price_wholesale, 
              price: (priceInUZS * currentCategory.whole_percent / 100) + priceInUZS},
            price_max: {...prev.price_max, 
              price: (priceInUZS * currentCategory.max_percent / 100) + priceInUZS},
            price_min: {...prev.price_min,
              price: (priceInUZS * currentCategory.min_percent / 100) + priceInUZS}, 
            
          }))
          setCurrentWhosale((priceInUZS * currentCategory.whole_percent / 100) + priceInUZS)
      }


      setCurrentRate(currency && currency[product.cost_price.currency_id - 1]?.rate.length ? currency[product.cost_price.currency_id - 1].rate[0].rate : 0)

      } , [product.cost_price, product.category_id])

 

 



 


  const handleSubmit = (e) => {
    dispatch(fetchingProducts())

    axios.put(`${URL}/api/product`, product, setToken())
    .then(res => {
      // dispatch(updateProduct(product))
      swal({
        title: 'Mahsulot muaffaqiyatli yangilandi',
        icon: 'success'
      })
      setOpen(false)
    })
    .catch(ress => {
      swal({
        title: t('xatolik')
      })
    })


  }



  const photoUploader = (e) => {
    const formData = new FormData()
    formData.append('file', e.file.originFileObj)
    formData.append('upload_preset', "smart-shop")
    setImageUploading(true)

    axios.post("https://api.cloudinary.com/v1_1/http-electro-life-texnopos-site/image/upload", formData).then(res => {
      setProduct(prev => ({...product, image: res.data.secure_url}))
      setUploaded(res.data.secure_url)
      setImageUploading(false)
    })
  } 

  return (
    <div >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item className="form__item" label="Kategoriyani tanlang" required>
          <Select value={product.category_id} onChange={e => setProduct({...product, category_id: e})} required className="form__input">
            {
              categories?.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item className="form__item" label="Brend nomini kiriting" required>
          <Input
            required
            placeholder="Brend nomi"
            value={product.brand}
            onChange={e => {
              setProduct({...product, brand: e.target.value})
            }}
            className="form__input"
          />
        </Form.Item>

        <Form.Item className="form__item" label="Mahsulot nomini kiriting" required>
          <Input 
            required
            placeholder="Mahsulot nomi"
            value={product.name}
            onChange={e => {setProduct({...product, name: e.target.value})}}
            className="form__input"
          />
        </Form.Item>

        <Form.Item className="form__item" label="Tan narxi" required>
        <Input.Group compact label="Tan narxi" required className='form-group'>
          <div className="form-group__item">
          <InputNumber 
            required
            placeholder="Tan narxi"
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={handleCurrency}
            value={product.cost_price.price}
          />
          </div>
          <div className="form-group__min-item">
          <Select className="form__select form__input"  value={costPriceCode} 
          onChange={e => {
            setProduct(prev => ({...product, cost_price: {...prev.cost_price, currency_id: e}}))
            setCostPriceCode(e)
          }} required  >
            {
              currency?.map(item => (
                <Select.Option value={item.id}>{item.code}</Select.Option>
              ))
            }
          </Select>
          </div>
        </Input.Group>
        </Form.Item>

        <Form.Item className="form__item" label="Ulgurji narxi" required> 
        <Input.Group compact label="Tan narxi" required className='form-group'>
          <div className="form-group__item">
          <InputNumber 
            required
            placeholder="Ulgurji narxi"
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => {
              setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: e}}))
              setWholePrice(e)
              setCurrentWhole(e)
            }}
            value={whole_price}
          />
          </div>
          <div className="form-group__min-item ">
          <Select className="form__select form__input"  value={whole_price_code} required onChange={e => {
            setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, currency_id: e}}))
            setWholePrice_code(e)
            if (e === 2) {
              if (whole_price_code === 1){
                setWholePrice((currentWhole / USD).toFixed(2))
              } else {
                setWholePrice(currentWhole)
              }
            } else {
              if (whole_price_code === 1) {
                setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: currentWhole}}))
              } else {
                setProduct(prev => ({...product, price_wholesale: {...prev.price_wholesale, price: currentWhole * USD}}))
              }
              setWholePrice(currentWhole)
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

        <Form.Item className="form__item" label="Minimum narxi" required>
        <InputNumber 
          required
            placeholder="Minimum narxi"
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => {
              setProduct(prev => ({...product, price_min: {...prev.price_min, price: e}}))
              setMinPrice(e)
            }}
            value={min_price}
          />
        </Form.Item>

        <Form.Item className="form__item" label="Maksimum narxi" required>
        <InputNumber 
            placeholder="Maksimum narxi"
            className="form__input"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            onChange={e => {
              setProduct(prev => ({...product, price_max: {...prev.price_max, price: e}}))
              setMaxPrice(e)
            }}
            value={max_price}
            required
          />
        </Form.Item>

        <Dragger className="photo__uploader" onChange={photoUploader} showUploadList={false}>
            {uploaded === '' ? (
              <>
                <i className='bx bx-cloud-upload ant-upload-drag-icon'></i>
                <h4>Rasm yuklang</h4>
                <p>Rasmni qurulmangizdan tanlang yoki shu yerga olib kelib tashlang</p>
              </>
            ) : (
              <>
                <i className='bx bx-check-circle success-icon'></i>
                <h4>Rasim yuklandi</h4>
              </>
            )}
      </Dragger> 
      <br />

        <Button className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center'}} htmlType="submit">Saqlash</Button>
        
      </Form>
    </div>
  )
}

export default UpdateContent
