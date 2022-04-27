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

  useEffect(async () => {
    dispatch(fetchingProducts());

    setLoading(true)

    const response = await axios.get(`${URL}/api/statistica/product?from=${from}&to=${to}`, setToken())

    if (response.status === 200) {
      setStatisticProducts(response.data.payload)
      setLoading(false)
    }

  } ,[from, to])


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
 

  return (
    
    <div className="section main-page">
      <h1 className="heading">{t('main')}</h1>

      <div className="content">
          <div className="content-top">
              <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder={t('categories')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              >
                  <Option>Hello</Option>
              </Select>


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
          <Table  className="content-table" dataSource={dataSource} columns={columns} />
          </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default Main
