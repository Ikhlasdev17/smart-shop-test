import { Select,DatePicker, Table, Skeleton, Input, InputNumber, Button, message } from 'antd'
import React, { useState, useEffect } from 'react'
import ModalAction from '../../components/ModalAction/ModalAction';

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import '../Main/Main.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { DebounceInput } from 'react-debounce-input';
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';

const { RangePicker } = DatePicker;
const {Option} = Select;

const OrderWarehouse = () => {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.productsReducer) 
  const [ statisticProducts, setStatisticProducts ] = useState([])
  const {categories, categoriesFetchingStatus} = useSelector(state => state.categoriesReducer)

  const now = Date.now()
  const [from, setFrom] = useState('2020-12-10')
  const [to, setTo] = useState(moment(now).format('YYYY-MM-DD')) 
  const [loading, setLoading] = useState(true)
  
  const [currency, setCurrency] = useState([])

  const [sendOrder, setSendOrder] = useState(false)

  const { t } = useTranslation()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState('')
  
  let updatedProducts = [];

  useEffect(async () => {
    dispatch(fetchingProducts());

    setLoading(true)

    const response = await axios.get(`${URL}/api/warehouse?search=${search}`, setToken())

    if (response.status === 200) {
      setStatisticProducts(response.data.payload.data)
      setLoading(false)
    }


  } ,[from, to, sendOrder, search])

  useEffect(() =>{
      axios.get(`${URL}/api/currency` , setToken())
      .then(res => setCurrency(res.data.payload))
  } ,[])


  useEffect(async () => {
    dispatch(fetchingCategories())

    const res = await axios.get(`${URL}/api/categories?search=${search}&category_id=${category}`, setToken());
    setLoading(true)
    if (res.status === 200) {
        dispatch(fetchedCategories(res.data.payload))
        setLoading(false)
    } else {
        dispatch(fetchingErrorCategories())
    }
    
}, [search, category])




  // ZAKAZ BERISH 
  const sendToOrder = () => {
    axios.post(`${URL}/api/warehouse`, updatedProducts, setToken())
    .then(res => {
      message.success(t('muaffaqiyatli'))
      setSendOrder(!sendOrder)
    })
  }


  const handleChange = (e, currentItem, type) => {
    const index = updatedProducts.findIndex(item => item.product_id === currentItem.product.id) 


    if (index === -1) {
        updatedProducts = [...updatedProducts,  {
            product_id: currentItem.product.id,
            count: type === 'count' ? e : currentItem.count,
            unit_id: currentItem.unit.id,
            price: {
                currency_id: currentItem.product.cost_price.currency_id,
                price: type === 'price' ? e : currentItem.product.cost_price.price
            }
        }]
    } else {
        if (type === 'price') {
            updatedProducts[index].price.price = e
            if (e === null){
              updatedProducts[index].price.price = currentItem?.product.cost_price.price
            }
          } else if (type === 'count') {
            updatedProducts[index].count = e 
            if (e === null){
              updatedProducts[index].price.price = currentItem?.count
            }
        }
    }
 
  }


  const dataSource = [];


  statisticProducts.length > 0 && statisticProducts?.map(item => {
    const currentCurrency = currency?.filter(x => x.id == item?.product?.cost_price.currency_id)[0]
    dataSource.push({
      key: item?.product.id,
      product: <div className="product__table-product">
          <div className="product__table-product__image"> 
              <Zoom>
                <img src={item?.product.image && item?.product.image !== null ? item?.product.image : 'https://seafood.vasep.com.vn/no-image.png'} alt="Product Photo" /> 
              </Zoom>
          </div>
          <div className="product__tabel-product_name">
              <h3>{item?.product.name}</h3>
          </div>
      </div>,
      count: item?.count,
      cost_price: <div className="form-group">
        <InputNumber size="small" className="form__input  table_input" placeholder={item.product.cost_price.price} onChange={(e) => {
        handleChange(e, item, 'price')
      }} />

      <Select placeholder={currentCurrency?.code} size="small" className="table_inptop__grouput form__input-small form-group__min-item" style={{width: '80px'}}>
          {currency?.map(item => (
              <Select.Option value={item.id}>{item.code}</Select.Option>
          ))}
      </Select>
      </div>,
      addCount: <>
        <InputNumber size="small" className="form__input table_input" placeholder={item.count} onChange={(e) => {
            handleChange(e, item, 'count')
        }}/>
      </>
    })
  })
  
  const columns = [
    {
      title: t('products'),
      dataIndex: 'product',
      key: 'key',
    },
    {
      title: t('hozir_bor'),
      dataIndex: 'count',
      key: 'key',
    },
    {
        title: t('cost_price'),
        dataIndex: 'cost_price',
        key: 'key',
      },
    {
        title: t('count'),
        dataIndex: 'addCount',
        key: 'key'
    }
  ];
 

  return (
    
    <div className="section main-page">
      <h1 className="heading">{t('order')}</h1>

      <div className="content">
          <div className="content-top">

               <div className='flex'>
               <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder="Kategoriyalar"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => setCategory(e)}
              value={category}
              >
                <Option value="">{t('all_categories')}</Option>
                {
                  categories?.map(item => (
                    <Option value={item.id}>{item.name}</Option>
                  ))
                }
              </Select>


              <DebounceInput
                onChange={(e) => setSearch(e.target.value)}
                className="form__input"
                minLength={2}
                debounceTimeout={800}
                value={search}
                placeholder={t('search')}
              />
              </div> 
              <div className='flex'>

              <div className="content-top__group">

              <DatePicker
                className="content__range-picker content-top__input form__input pl-1"
                placeholder={t('from')}
                onChange={(value, string) => {
                  setFrom(string)
                } }
                value={moment(from)}
                />


              <DatePicker
                className="content__range-picker content-top__input form__input pl-1 "
                placeholder={t('from')}
                onChange={(value, string) => {
                  setTo(string)
                } }
                value={moment(to)}
                />
                
              </div>

              <Button onClick={() =>sendToOrder()}className="btn btn-primary">{t('saqlash')}</Button>
                </div>
          </div>


          <div className="content-body" >
          <Skeleton loading={loading} active> 
          <Table  className="content-table" dataSource={dataSource} columns={columns} />
          </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default OrderWarehouse
