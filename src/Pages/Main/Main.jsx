import { Select,DatePicker, Table, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react'
import ModalAction from '../../components/ModalAction/ModalAction';

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import './Main.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import moment from 'moment'

import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const {Option} = Select;

const Main = () => {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.productsReducer) 
  const [ statisticProducts, setStatisticProducts ] = useState([])
  const now = Date.now()
  const [from, setFrom] = useState('2020-12-10')
  const [to, setTo] = useState(moment(now).format('YYYY-MM-DD')) 
  const [loading, setLoading] = useState(true)
  const {t} = useTranslation()
  const [category_id, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [employes, setEmployes] = useState([])
  const [employeeId, setEmployeeId] = useState("")

  useEffect(async () => {
    dispatch(fetchingProducts());

    setLoading(true)

    const response = await axios.get(`${URL}/api/statistica/product?from=${from}&to=${to}&category_id=${category_id !== '' && category_id}&employee_id=${employeeId !== "" && employeeId }`, setToken())

    if (response.status === 200) {
      setStatisticProducts(response.data.payload)
      setLoading(false)
    }

  } ,[from, to, category_id, employeeId])

  useEffect(() => {
    axios.get(`${URL}/api/categories`, setToken())
    .then(res => setCategories(res.data.payload))


    axios.get(`${URL}/api/employees`, setToken())
    .then(res => {
      setEmployes(res.data.payload)
    })
    
  }, [])


  const dataSource = [];

  statisticProducts?.map(item => {
    dataSource.push({
      key: item?.product_id,
      product: <div className="product__table-product">
      <div className="product__table-product__image"> 
          <Zoom>
            <img src={item?.image && item?.image !== null ? item?.image : 'https://seafood.vasep.com.vn/no-image.png'} alt="Product Photo" /> 
          </Zoom>
      </div>
      <div className="product__tabel-product_name">
          <h3>{item?.product_name}</h3>
      </div>
  </div>,
      count: item?.count
    })
  })
  
  const columns = [
    {
      title: t('products'),
      dataIndex: 'product',
      key: 'key',
    },
    {
      title: t('number_of_product'),
      dataIndex: 'count',
      key: 'key',
    }
  ];



  console.info(statisticProducts)
 

  return (
    
    <div className="section main-page">
      <h1 className="heading">{t('main')}</h1>

      <div className="content">
          <div className="content-top">
              <div className="content-top__group">

              <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder={t('categories')}
              optionFilterProp="children"
              onChange={e => setCategoryId(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              >
                <Option value={''}>{t('all')}</Option>
                  {
                    categories?.map(item => (
                      <Option value={item.id}>{item.name}</Option>
                    ))
                  }
              </Select>

              
              <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder={t('sellers')}
              optionFilterProp="children"
              onChange={e => setEmployeeId(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              >
                <Option value={''}>{t('all')}</Option>
                  {
                    employes?.map(item => (
                      <Option value={item.id}>{item.name}</Option>
                    ))
                  }
              </Select>
                      </div>


              <div className="content-top__group">

              <DatePicker
                className="content__range-picker content-top__input form__input "
                placeholder={t('from')}
                onChange={(value, string) => {
                  setFrom(string)
                } }
                value={moment(from)}
                />


              <DatePicker
                className="content__range-picker content-top__input form__input  "
                placeholder={t('from')}
                onChange={(value, string) => {
                  setTo(string)
                } }
                value={moment(to)}
                />
                </div>
          </div>


          <div className="content-body" >
          <Skeleton loading={loading} active>  
          <Table  className="content-table lg-table" dataSource={dataSource} columns={columns} />
          
          <div className="responsive__table">
              {statisticProducts &&
                statisticProducts.length > 0 ?
                statisticProducts.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index} 
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.product_name}</h3>
                      </div>
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.count}</h3>
                      </div>
                      
                        
                    </div>
                  );
                }) : null}
            </div>
          
          </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default Main
