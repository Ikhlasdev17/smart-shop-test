import { Select,DatePicker, Table, Button, Input, Drawer, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react'

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import './Order.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';
import { fetchedOrders, fetchingOrders } from '../../redux/ordersSlice';
import moment from 'moment';
// import Content from './Content';


import { useTranslation } from 'react-i18next';
import Content from './Content';


const { RangePicker } = DatePicker;
const {Option} = Select;

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, ordersFetchingStatus } = useSelector(state => state.ordersReducer)
  const [category,setCategory] = useState('') 
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [baskets, setBaskets] = useState({})
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [currentBasketId, setCurrentBasketId] = useState('')

  const [amount, setAmount] = useState({})

  useEffect(async () => {
    dispatch(fetchingCategories())

    setLoading(true)

    const res = await axios.get(`${URL}/api/categories`, setToken())
    .then(res => {
      dispatch(fetchedCategories(res.data.payload))
      setLoading(false)
    })
    
    }, []) 

  
  const dataSource = [];
  orders?.map(item => { 
      dataSource.push({
          client: <div className="table-title"
          ><h3>{item?.user.name}</h3>
            <p>{item?.user.phone}</p>
          </div>,
            cash: item?.cash.toLocaleString(),
            card: item?.card.toLocaleString(),
            debt: <span><strong>{item?.debt.debt.toLocaleString()}</strong> <br /> {item?.debt.remaining.toLocaleString()}</span>,
            total: <span>{(item?.cash + item?.card + item?.debt.debt).toLocaleString()}</span>,
            description: <span>{item?.debt.debt > 0 ? t('qarz') : t('kirim')}</span>,
            completed: <span><strong>{item?.term ? moment(item?.term).format('MMM DD, YYYY') : ''}</strong></span>,
            actions: (<>
                <Button 
                  className="table-action"
                  onClick={e => {
                    setOpen(!open)
                    setCurrentBasketId(item?.id)
                  }}
                  >
                  <i className="bx bx-copy"></i>
                </Button>
                </>
            )
        })
  })




    console.warn(orders);
  
  const columns = [
    {
      title: t('clients'),
      dataIndex: 'client',
      key: 'key',
    },
    {
      title: t('cash'),
      dataIndex: 'cash',
      key: 'key',
    },
    {
      title: t('card'),
      dataIndex: 'card',
      key: 'key',
    },
    {
      title: t('qarz'),
      dataIndex: 'debt',
      key: 'key',
    },
    {
      title: t('total_income'),
      dataIndex: 'total',
      key: 'key',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'key',
    },
    {
      title: t('qarzni_tolash_sanasi'),
      dataIndex: 'completed',
      key: 'key',
    },
    {
      title: t('action'),
      dataIndex: 'actions',
      key: 'key',
    }

  ];


  const orderType = [ 
    {id: 'debt', name: t('qarz')},
    {id: 'paid', name: t('kirim')},
    {id: 'cash', name: t('cash')}
  ]
  



  useEffect(async () => {
    dispatch(fetchingOrders());

    const response = await axios.get(`${URL}/api/baskets?search=${search}&filter=${filter}&page=${page}&filter=${category}`, setToken())

    if (response.status === 200) {
      dispatch(fetchedOrders(response.data.payload.data.baskets));
      setAmount(response.data.payload.data.amount)
    }

    console.info(response);




   
    
  } ,[search, filter, page, category])


  useEffect(() => {
    axios.get(`${URL}/api/baskets` , setToken()) 
    .then(res => setBaskets(res.data.payload))
  } ,[])





 

  return (
    
    <div className="section products-page"> 

      <Drawer size="large" visible={open} onClose={() => setOpen(false)} title={t('return')}>
        <Content orders={orders} setOpen={() => setOpen()} currentBasketItemId={currentBasketId} />
      </Drawer>

      <div className="top__elements">
      <h1 className="heading">{t('offers')}</h1>

      <div className="top__elements-right">
        <span><strong>{t('cash')}:</strong> {amount?.cash?.toLocaleString()}</span>
        <span><strong>{t('card')}:</strong>: {amount?.card?.toLocaleString()}</span>
        <span><strong>{t('total_income')}:</strong> {(amount?.cash  + amount?.card)?.toLocaleString()}</span>
      </div>
      </div>

      <div className="content">
          <div className="content-top">

                <Input 
                placeholder={t('search')}
                onChange={e => setSearch(e.target.value)}
                className="form__input"
                />
              <Select
              className="form__input content-select content-top__input"
              showSearch
              placeholder={t('categories')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => setCategory(e)}
              value={category}
              >

                <Option value={''}>{t('all')}</Option>
                  {
                    orderType.map((type) => {
                      return (
                        <Option key={type.id} value={type.id}>{type.name}</Option>
                      )
                    })
                  }
              </Select>

              


              {/* <div className="content-top__group">

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
                </div> */}

          <DatePicker 
            className="form__input wdith_3"
            placeholder={t('qarz_muddati')}
          />
          </div>


          <div className="content-body" >
            <Skeleton loading={loading} active>
            <Table size="small" rowClassName={"table-row"} className="content-table"  dataSource={dataSource} columns={columns} />
            </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default Orders
