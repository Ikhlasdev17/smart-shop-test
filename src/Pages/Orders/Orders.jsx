import { Select,DatePicker, Table, Button, Input, Drawer, Skeleton, Modal, Pagination } from 'antd'
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
import { clientsFetchingError, fetchedClients, fetchingClients } from '../../redux/clientsReducer';
import { DebounceInput } from 'react-debounce-input';


const { RangePicker } = DatePicker;
const {Option} = Select;

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, ordersFetchingStatus } = useSelector(state => state.ordersReducer)
  const {clients, clientsFetchingStatus} = useSelector(state => state.clientsReducer)
  const [category,setCategory] = useState(['']) 
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [baskets, setBaskets] = useState({})
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [currentBasketId, setCurrentBasketId] = useState('')

  const [amount, setAmount] = useState({})

  const [descriptionModal, setDescriptionModal] = useState("")
  const [descrModalOpen, setDescrModalOpen] = useState(false)
  const [lastPage, setLastPage] = useState()
  const [perPage, setPerPage] = useState()
  const [currentSelectedBasket, setCurrentSelectedBasket] = useState("")

  const [user, setUser] = useState("")


  const [refresh, setRefresh] = useState(false)


  const [productDetailsIsOpen, setProductDetailsIsOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});

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
            <p>+998{item?.user.phone}</p>
          </div>,
            cash: item?.cash.toLocaleString(),
            card: item?.card.toLocaleString(),
            debt: <span><strong>{item?.debt.debt.toLocaleString()}</strong> <br /> <span style={{color: '#eb6767'}}>{item?.debt.remaining.toLocaleString()}</span></span>,
            total: <span>{(item?.cash + item?.card + item?.debt.debt).toLocaleString()}</span>,
            description: <>
                {item?.description !== null ? <>
                  <span style={{cursor: 'pointer', textTransform: 'capitalize'}} onClick={() => {
                    setDescriptionModal(item?.description)
                    setDescrModalOpen(true)
                  }}> 
                    {item?.description.slice(0, 20)}
                  </span>
                </> : 
                  <span>{item?.debt.debt > 0 ? t('qarz') : t('kirim')}</span>
                }
              
            </>, 
            
            completed: <span><strong>{item?.term ? moment(item?.term).format('MMM DD, YYYY') : ''}</strong></span>,
            actions: (<>
                <Button 
                  className="table-action"
                  onClick={e => {
                    setOpen(!open)
                    setCurrentBasketId(item?.id)
                    setCurrentSelectedBasket(item)
                  }}
                  >
                  <i className="bx bx-copy"></i>
                </Button>
                </>
            )
        })
  })



  useEffect(async () =>{
    dispatch(fetchingClients())

    axios.get(`${URL}/api/clients`, setToken())
    .then(res => {
      dispatch(fetchedClients(res.data.payload.data.clients)) 
    })
    .catch(err => {
      dispatch(clientsFetchingError())
    })
  } ,[])
 

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
    {id: 'debt', name: t('qarz')}, // debt|paid|cashS
    {id: 'card', name: t('card')},
    {id: 'cash', name: t('cash')}
  ]
  

  let text = ''
  category.map((item, index) => {
    if (index !== (category.length - 1)){
      text += `${item}|` 
    } else {
      text += `${item}` 
    }
  })



  useEffect(async () => {
    dispatch(fetchingOrders());

    setLoading(true)

    const response = await axios.get(`${URL}/api/baskets?search=${search}&filter=${filter}&page=${page}&filter=${text}&user_id=${user}`, setToken())

    if (response.status === 200) {
      dispatch(fetchedOrders(response.data.payload.data.baskets));
      setAmount(response.data.payload.data.amount)
      setLoading(false)
      setPerPage(response.data.payload.per_page)
      setLastPage(response.data.payload.last_page)
    }

    
  } ,[search, filter, page, category, user, refresh])


  useEffect(() => {
    axios.get(`${URL}/api/baskets` , setToken()) 
    .then(res => setBaskets(res.data.payload))
  } ,[])

  

  const handleCategorySelect = (e, value) => {
    if (e[e.length - 1] === '') {
      setCategory([''])
    } else {
      setCategory(e?.filter(item => item !== ''))
      }
  }

 

  return (
    
    <div className="section products-page"> 

      <Drawer className='drawer-big' size="large" visible={open} onClose={() => setOpen(false)} title={t('return')}>
        <Content refresh={refresh} setRefresh={() => setRefresh(!refresh)} basket={currentSelectedBasket} open={open} orders={orders} setOpen={() => setOpen()} currentBasketItemId={currentBasketId} />
      </Drawer>

      {!open && productDetailsIsOpen ? (
        <Modal
          footer={null}
          visible={productDetailsIsOpen}
          onCancel={() => {
            setProductDetailsIsOpen(false);
            setProductDetails({});
          }}
        >
          <h2>{productDetails?.name}</h2>
          <table className="product__details-table">
            <tbody className="product__details-table__body">
              <tr>
                <td>{t("client")}</td>
                <td>
                  {productDetails?.user.name}
                </td>
              </tr>

              <tr>
                <td>{t("telefon_raqami")}</td>
                <td>
                  +998{productDetails?.user.phone}
                </td>
              </tr>

              <tr>
                <td>{t("cash")}</td>
                <td>
                  {productDetails?.cash.toLocaleString()} 
                </td>
              </tr>
              <tr>
                <td>{t("card")}</td>
                <td>
                  {productDetails?.card.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>{t("tolangan_qarz")}</td>
                <td>
                <span><strong>{productDetails?.debt.debt.toLocaleString()}</strong> <br /> </span>
                </td>
              </tr>

              <tr>
                <td>{t("qarz")}</td>
                <td>
                 <span style={{color: '#eb6767'}}>{productDetails?.debt.remaining.toLocaleString()}</span>
                </td>
              </tr>

              <tr>
                <td>{t("total_income")}</td>
                <td>
                <span>{(productDetails?.cash + productDetails?.card + productDetails?.debt.debt).toLocaleString()}</span>
                </td>
              </tr>

              <tr>
                <td>{t("qarzni_tolash_sanasi")}</td>
                <td>
                <span><span><strong>{productDetails?.term ? moment(productDetails?.term).format('MMM DD, YYYY') : ''}</strong></span></span>
                </td>
              </tr>
            </tbody>
          </table>

          <blockquote className='description'>
            <strong>{t('description')}: </strong>
            {productDetails?.description !== null ? <>
                  <span style={{cursor: 'pointer', textTransform: 'capitalize'}} onClick={() => {
                    setDescriptionModal(productDetails?.description)
                    setDescrModalOpen(true)
                  }}> 
                    {productDetails?.description.slice(0, 20)}
                  </span>
                </> : 
                  <span>{productDetails?.debt.debt > 0 ? t('qarz') : t('kirim')}</span>}
          </blockquote> 
        </Modal>
      ) : null}

      <Modal visible={descrModalOpen} onOk={e => {
        setDescrModalOpen(false)
        setDescriptionModal("")
      }} onCancel={() => {
        setDescrModalOpen(false)
        setDescriptionModal("")
      }}>
        {descriptionModal ? descriptionModal : ''}
      </Modal>

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

           <div className="flex">
                  <DebounceInput
                  debounceTimeout={800}
                  minLength={2}
                placeholder={t('search')}
                onChange={e => setSearch(e.target.value)}
                className="form__input"
                />
              <Select
              mode='multiple'
              className="form__input content-select content-top__input"
              showSearch
              placeholder={t('all_payment')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(e, value) => handleCategorySelect(e, value)}
              value={category}
              >

                <Option value={''}>{t('all_payment')}</Option>
                  {
                    orderType.map((type) => {
                      return (
                        <Option key={type.id} value={type.id}>{type.name}</Option>
                      )
                    })
                  }
              </Select>
              <Select 
              className="form__input content-select content-top__input"
              showSearch
              placeholder={t('select_client')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(e, value) => setUser(e, value)}
              value={user}
              >

                <Option value={''}>{t('all_client')}</Option>
                  {
                    clients.map((type) => {
                      return (
                        <Option key={type.id} value={type.id}>{type.full_name}</Option>
                      )
                    })
                  }
              </Select>

       

          <DatePicker 
            className="form__input wdith_3"
            placeholder={t('qarz_muddati')}
            />
            </div>
          </div>


          <div className="content-body" >
            <Skeleton loading={loading} active>
            <Table pagination={false} size="small" rowClassName={"table-row"} className="content-table lg-table"  dataSource={dataSource} columns={columns} />
              

            <div className="responsive__table">
              {orders &&
                orders.length > 0 &&
                orders.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        !(e.target.classList.value.includes("bx")) && 
                          setProductDetailsIsOpen(true); 
                          setProductDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.user.name}</h3>
                        <h4>+998 {item?.user.phone}</h4> 
                      </div> 
                      <div> 

                        <div className="responsive__table-item__details-actions">
                          <div className="table-button__group">
                          <Button 
                            className="table-action"
                            onClick={e => {
                              setOpen(!open)
                              setCurrentBasketId(item?.id)
                              setCurrentSelectedBasket(item)
                            }}
                            >
                            <i className="bx bx-copy"></i>
                          </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>


            {lastPage > 1 && (
              <div className="pagination__bottom">
              <Pagination 
                total={lastPage * perPage} 
                pageSize={perPage ? perPage : 0}
                current={page}
                onChange={c => setPage(c)}
                showSizeChanger={false}
              />
            </div>
            )}
            </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default Orders
