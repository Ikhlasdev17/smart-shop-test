import { Select,DatePicker, Table, Skeleton, Input, InputNumber, Button, message, Pagination, Form } from 'antd'
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
  const [lastPage, setLastPage] = useState();
  const [perPage, setPerPage] = useState();
  const [page, setPage] = useState(1); 
  const [updatedProductsState, setUpdatedProductsState] = useState([])
  

  

  useEffect(async () => {
    dispatch(fetchingProducts());
    setLoading(true)
    const response = await axios.get(
      `${URL}/api/products?search=${search}&page=${page}&category_id=${category}`,
      setToken()
    );
    if (response.status === 200) {
      setStatisticProducts(response.data.payload.data)
      setLoading(false)
      setLastPage(response.data.payload.last_page)
      setPerPage(response.data.payload.per_page) 
    }
  } ,[from, to, sendOrder, search, page, category])

  


  useEffect(() =>{
      axios.get(`${URL}/api/currency` , setToken())
      .then(res => setCurrency(res.data.payload))
  } ,[])


  useEffect(async () => {
    dispatch(fetchingCategories())

    const res = await axios.get(`${URL}/api/categories`, setToken());
    setLoading(true)
    if (res.status === 200) {
        dispatch(fetchedCategories(res.data.payload))
        setLoading(false)
    } else {
        dispatch(fetchingErrorCategories())
    }
    
}, [])







  const handleChange = (e, currentItem, type) => {
    let updatedProducts = updatedProductsState
    const index = updatedProducts.findIndex(item => item.product_id === currentItem.id) 
    if (index === -1) {
        updatedProducts = [...updatedProducts,  {
            product_id: currentItem.id,
            count: type === 'count' ? e !== null ? e : 0 : 0,
            unit_id: currentItem?.warehouse?.unit.id,
            price: {
                currency_id: type === 'currency' ? e : currentItem.cost_price.currency_id,
                price: type === 'price' ? e : currentItem.cost_price.price
            },
            max_price: {
              price: type === "max_price" ? e : currentItem.max_price.price,
              currency_id: currentItem.max_price.currency_id,
            },
            min_price: {
              price: type === "min_price" ? e : currentItem.min_price.price,
              currency_id: currentItem.min_price.currency_id,
            },
            whole_price: {
              price: type === "whole_price" ? e : currentItem.whole_price.price,
              currency_id: type === "whole_currency" ? e : currentItem.whole_price.currency_id,
            },
        }]
        setUpdatedProductsState(updatedProducts) 
    } else {
        if (type === 'price') {
          if (e === null){
            updatedProducts[index].price.price = currentItem?.cost_price.price
          } else {
            updatedProducts[index].price.price = e
          }
          } else if (type === 'count') {
            if (e == null){
              updatedProducts[index].count = 0
            } else {
              updatedProducts[index].count = e 
            }
        } else if (type === 'currency') {
          if (e === null){
            updatedProducts[index].price.currency_id = currentItem?.cost_price?.currency_id
          } else {
            updatedProducts[index].price.currency_id = e
          }
        } else if (type === "max_price") {
          if (e === null){
            updatedProducts[index].max_price.price = currentItem?.max_price?.price
          } else {
            updatedProducts[index].max_price.price = e
          }
        } else if (type === "min_price") {
          if (e === null){
            updatedProducts[index].min_price.price = currentItem?.min_price?.price
          } else {
            updatedProducts[index].min_price.price = e
          }
        } else if (type === "whole_price") {
          if (e === null){
            updatedProducts[index].whole_price.price = currentItem?.whole_price?.price
          } else {
            updatedProducts[index].whole_price.price = e
          }
        } else if (type === "whole_currency"){
          if (e === null){
            updatedProducts[index].whole_price.currency_id = currentItem?.whole_price?.currency_id
          } else {
            updatedProducts[index].whole_price.currency_id = e
            setUpdatedProductsState(updatedProducts) 
          }
        }
        setUpdatedProductsState(updatedProducts) 
    }

    console.info(currentItem)

    
  }

  

  const dataSource = [];


  statisticProducts.length > 0 && statisticProducts?.map(item => {
    const currentCurrency = currency?.filter(x => x.id == item?.cost_price.currency_id)[0]
    const currentWholeCurrency = currency?.filter(x => x.id == item?.whole_price?.currency_id)[0]
    dataSource.push({
      key: item?.id,
      product: <div className="product__table-product">
          <div className="product__table-product__image"> 
              <Zoom>
                <img src={item?.image && item?.image !== null ? item?.image : 'https://seafood.vasep.com.vn/no-image.png'} alt="Product Photo" /> 
              </Zoom>
          </div>
          <div className="product__tabel-product_name">
              <h3>{item?.name}</h3>
          </div>
      </div>,
      count: item?.warehouse?.count !== null ? item?.warehouse?.count : 0,
      cost_price: <div className='expanded-content'>
        <>
          <div className="expanded-label">
            <span>{ t('cost_price') }</span>
            <Input.Group compact>
                <InputNumber   
                  className="expanded_input" 
                  placeholder={item?.cost_price?.price !== null ? item?.cost_price?.price : '0'} onChange={(e) => {
                  handleChange(e, item, 'price')
                }} />
                <Select 
                placeholder={currentCurrency?.code} 
                
                className="" 
                style={{width: '80px'}}
                onChange={(e) => {
                  handleChange(e, item, 'currency')
                }}
              >
                  {currency?.map(item => (
                      <Select.Option value={item.id}>{item.code}</Select.Option>
                  ))}
              </Select>
            </Input.Group>
          </div>
          <div className="expanded-label">
            <span>{ t('whole_price') }</span>
            <Input.Group compact>
                <InputNumber   className="expanded_input" placeholder={item?.whole_price?.price !== null ? item?.whole_price?.price : '0'} onChange={(e) => {
                  handleChange(e, item, 'whole_price')
                }} />
                <Select 
                    placeholder={currentWholeCurrency?.code} 
                    className="" 
                    style={{width: '80px'}}
                    onChange={(e) => {
                      handleChange(e, item, 'whole_currency')
                      console.info(e)
                    }}
                  >
                  {currency?.map(item => (
                      <Select.Option value={item.id}>{item.code}</Select.Option>
                  ))}
              </Select>
            </Input.Group>
          </div>
          <div className="expanded-label">
            <span>{ t('min_price') }</span>
            <InputNumber  className="expanded_input" placeholder={item?.min_price?.price !== null ? item?.min_price?.price : '0'} onChange={(e) => {
              handleChange(e, item, 'min_price')
            }} />
          </div>
          <div className="expanded-label">
            <span>{ t('max_price') }</span>
            <InputNumber  className="expanded_input" placeholder={item?.max_price?.price !== null ? item?.max_price?.price : '0'} onChange={(e) => {
              handleChange(e, item, 'max_price')
            }} />
          </div>
        </>
      
      </div>,
      addCount: <div className='form-group'>
        <InputNumber className="form__input table_input" placeholder={item?.warehouse?.count !== null ? item?.warehouse?.count : 0} onChange={(e) => {
            handleChange(e, item, 'count')
        }}/>
      </div>
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
        title: t('count'),
        dataIndex: 'addCount',
        key: 'key'
    }
  ];

    // ZAKAZ BERISH 
    const sendToOrder = () => {
      axios.post(`${URL}/api/warehouse`, updatedProductsState, setToken())
      .then(() => {
        message.success(t('muaffaqiyatli'))
        setSendOrder(!sendOrder)
        setUpdatedProductsState([])
      })
      .catch((err) => {
        message.error(t('qayta_urinib_koring'))
        setUpdatedProductsState([])
      })

      console.info(updatedProductsState)
    }
 

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
                onChange={(e) => {
                  setPage(1)
                  setSearch(e.target.value)
                }}
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
                clearIcon={false}
                />


              <DatePicker
                className="content__range-picker content-top__input form__input pl-1 "
                placeholder={t('from')}
                onChange={(value, string) => {
                  setTo(string)
                } }
                value={moment(to)}
                clearIcon={false}
                />
                
              </div>

              <Button disabled={updatedProductsState.length === 0} onClick={() =>sendToOrder()}className="btn btn-primary">{t('saqlash')}</Button>
                </div>
          </div>


          <div className="content-body" >
          <Skeleton loading={loading} active> 
          <Table  
            className="content-table" 
            dataSource={dataSource} 
            columns={columns} 
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {record.cost_price}
                </p>
              ),
              rowExpandable: (record) => record.name !== 'Not Expandable',
            }}
          />
          </Skeleton>

          {lastPage > 1 && (
            <div className="pagination__bottom">
              <Pagination
                total={lastPage * perPage}
                pageSize={perPage ? perPage : 0}
                current={page}
                onChange={(c) => setPage(c)}
                showSizeChanger={false}
                
              />
            </div>
          )}
          </div>
      </div>
    </div>
  )
}

export default OrderWarehouse
