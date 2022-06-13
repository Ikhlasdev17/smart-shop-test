import { Select,DatePicker, Table, Button, Input, Drawer, Skeleton, Pagination } from 'antd'
import React, { useState, useEffect } from 'react'

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import './Consumtions.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';
import { fetchedOrders, fetchingOrders } from '../../redux/ordersSlice';
import moment from 'moment';
// import Content from './Content';
import { useLocation } from 'react-router-dom';
import Content from './Content';
import { fetchingConsumption, fetchedConsumptions } from '../../redux/consumtionSlice';



import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const {Option} = Select;

const Consumptions = () => {
  const dispatch = useDispatch()
  const { orders, ordersFetchingStatus } = useSelector(state => state.ordersReducer)
  const [categories, setCategories ] = useState() 
  const type = useLocation()
  const [from, setFrom] = useState('2020-01-01')
  const [to, setTo] = useState('2024-04-12') 
  const [consumption, setConsumption] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const {consumptions, consumptionsLoadingStatus } = useSelector(state => state.consumptionReducer)

  const { t } = useTranslation()
  const [lastPage, setLastPage] = useState()
  const [perPage, setPerPage] = useState()
  const [currentPage, setCurrentPage] = useState()
  const [refresh, setRefresh] = useState(false)


  useEffect(async () => {
    dispatch(fetchingCategories())

    await axios.get(`${URL}/api/consumption/categories`, setToken())
    .then(res => {
      setCategories(res.data.payload) 
    })
    
    
    }, []) 

  
  const dataSource = [];


  consumptions?.length > 0 && consumptions.map(item => { 
      dataSource.push({
          category: <div className="table-title"><h3>{item?.category_name.uz}</h3></div>,
            kimga: item?.whom,
            price: item?.price !== null && item?.price.toLocaleString(),
            description: <span><strong>{item?.description}</strong></span>,
            date: <span>{item?.date}</span>
        })
  })


  
  const columns = [
    {
      title: t('categories'),
      dataIndex: 'category',
      key: 'key',
    },
    {
      title: t('kimga'),
      dataIndex: 'kimga',
      key: 'key',
    },
    {
      title: t('sum'),
      dataIndex: 'price',
      key: 'key',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'key',
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'key',
    },

  ];

  

  
  
  useEffect(async () => { 
    dispatch(fetchingConsumption());
    setLoading(true);

    const response = await axios.get(`${URL}/api/consumptions?from=${from !== '' ? from : '2020-04-04'}&to=${to !== '' ? to : moment(Date.now()).format('YYYY-MM-DD')}&type=${type.pathname.slice(14, type.pathname.length)}&page=${currentPage}`, setToken())

    if (response.status === 200) {
      dispatch(fetchedConsumptions(response.data.payload.data.items))
      setLoading(false)
      setLastPage(response.data.payload.last_page)
      setPerPage(response.data.payload.per_page)
    }


  } ,[type, from, to, currentPage, refresh])
 

  return (
    
    <div className="section products-page">

    <Drawer title={type.pathname.slice(14, type.pathname.length) === 'income' ? t('kirim_qoshish') : t('xarajat_qoshish')} visible={open} onClose={() => setOpen(false)}>
      <Content open={open} setRefresh={setRefresh} refresh={refresh} setOpen={() => setOpen()} categories={categories} type={type.pathname.slice(14, type.pathname.length)} />
    </Drawer>

      <h1 className="heading">{type.pathname.slice(14, type.pathname.length) === 'consumption' ? t('consumption') : t('income')}</h1>

      <div className="content">
          <div className="content-top">
             <div style={{display: 'flex', gap: '1rem'}} className="flex"> 
               

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
             </div>

             <Button onClick={() => setOpen(!open)} className="btn btn-primary"><i className="bx bx-plus"></i> {type.pathname.slice(14, type.pathname.length) === 'income' ?  t('kirim_qoshish') : t('xarajat_qoshish')}</Button>
          </div>


          <div className="content-body" >
            <Skeleton loading={loading} active>
            <Table pagination={false} className="content-table"  dataSource={dataSource} columns={columns} />
            </Skeleton>
          </div>


          {lastPage > 1 && (
              <div className="pagination__bottom">
              <Pagination 
                total={lastPage * perPage} 
                pageSize={perPage}
                defaultCurrent={currentPage}
                onChange={c => setCurrentPage(c)}
                showSizeChanger={false}
              />
            </div>
          )}
      </div>
    </div>
  )
}

export default Consumptions
