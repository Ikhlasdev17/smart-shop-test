import { Select,DatePicker, Table, Skeleton, Input } from 'antd'
import React, { useState, useEffect } from 'react'

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import '../Main/Main.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import 'react-medium-image-zoom/dist/styles.css'

import moment from 'moment'

import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const {Option} = Select;

const Casheir = () => {
  const dispatch = useDispatch()
  const [ casheir, setCasheir ] = useState([])
  const now = Date.now()
  const [from, setFrom] = useState('2020-12-10')
  const [to, setTo] = useState(moment(now).format('YYYY-MM-DD')) 
  const [loading, setLoading] = useState(true)
  const {t} = useTranslation()


  const months = [
    {id: 1, name: t('yanvar')},
    {id: 2, name: t('fevral')},
    {id: 3, name: t('mart')},
    {id: 4, name: t('aprel')},
    {id: 5, name: t('may')},
    {id: 6, name: t('iyun')},
    {id: 7, name: t('iyul')},
    {id: 8, name: t('avgust')},
    {id: 9, name: t('sentyabr')},
    {id: 10, name: t('oktyabr')},
    {id: 11, name: t('noyabr')},
    {id: 12, name: t('dekabr')},
  ]

  useEffect(async () => {
    dispatch(fetchingProducts());

    setLoading(true)

    const response = await axios.get(`${URL}/api/cashier/monthly?from=${from}&to=${to}`, setToken())

    if (response.status === 200) {
      setCasheir(response.data.payload)
      setLoading(false)
    }

  } ,[from, to])


  const dataSource = [];

  casheir.length > 0 && casheir?.map(item => {
    dataSource.push({
      key: item?.product_id,
      oy:<div className="table-title">
        <h2>{months.filter(m => m.id === item?.month)[0].name}</h2>  
        <p>{item.year}</p>
        </div>,
      card: item.card !== null && item.card?.toLocaleString(),
      cash: item.cash !== null && item.cash?.toLocaleString(),
      sof_foyda: item.profit !== null && item.profit?.toLocaleString()
    })
  })
  
  const columns = [
    {
      title: t('oy'),
      dataIndex: 'oy',
      key: 'key',
    },
    {
      title: t('card'),
      dataIndex: 'card',
      key: 'key',
    },
    {
      title: t('cash'),
      dataIndex: 'cash',
      key: 'key',
    },
    {
      title: t('sof_foyda'),
      dataIndex: 'sof_foyda',
      key: 'key',
    }
  ];
 

  return (
    
    <div className="section main-page">
      <h1 className="heading">{t('sof_foyda')}</h1>

      <div className="content">
          <div className="content-top">  

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
                className="content__range-picker content-top__input form__input  pl-1"
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

export default Casheir
