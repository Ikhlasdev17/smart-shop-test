import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton, Pagination } from 'antd'
import Content from './Content';
import React, { useState, useEffect } from 'react' 
import { useSelector, useDispatch } from 'react-redux';
import { fetchingClients, fetchedClients, clientsFetchingError } from '../../redux/clientsReducer';
import './Clients.scss';


import axios from 'axios';

import {setToken, URL} from '../../assets/api/URL';

import { useTranslation } from 'react-i18next';

const {Option} = Select;

const Clients = () => {
  const [open, setOpen] = useState()
  const {clients, clientsFetchingStatus} = useSelector(state => state.clientsReducer)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true) 
  const [search, setSearch] = useState('')
  const [currentClient, setCurrentClient] = useState({}) 
  const [modalType, setModalType] = useState('')
  const { t } = useTranslation()
  const [lastPage, setLastPage] = useState()
  const [perPage, setPerPage] = useState()
  const [currentPage, setCurrentPage] = useState()



  const dataSource = [];


    clients?.map(item => { 
      dataSource.push({
        key: item.id,
        name: <div className="table-title"> <h2>{item.full_name}</h2> <p>{item.phone}</p></div>,
        balance: item.balance,
        stir: item.tin ? item.tin : 'Jismoniy Shaxs',
        excerpt: item.about,
        type: item.type,
        action: (
          <>
            <Button className="table-action" onClick={() => {
              setOpen(!open)
              setCurrentClient(item)
              setModalType('update')
            }}><i className="bx bx-edit"></i></Button>
          </>
        )
      })
    })
  
  
  const columns = [
    {
      title: t('fio'),
      dataIndex: 'name',
      key: 'key',
    },

    {
      title: t('balance'),
      dataIndex: 'balance',
      key: 'key'
    },

    {
      title: t('stir'),
      dataIndex: 'stir',
      key: 'key'
    },

    {
      title: t('about__client'),
      dataIndex: 'excerpt',
      key: 'key'
    },

    {
      title: t('action'),
      dataIndex: 'action',
      key: 'key'
    }
  ];


  useEffect(async () =>{
    dispatch(fetchingClients())

    axios.get(`${URL}/api/clients?search=${search}&page=${currentPage}`, setToken())
    .then(res => {
      dispatch(fetchedClients(res.data.payload.data.clients)) 
      setLoading(false)
      setLastPage(res.data.payload.last_page)
      setPerPage(res.data.payload.per_page)
    })
    .catch(err => {
      setLoading(false)
      dispatch(clientsFetchingError())
    })
  } ,[open, search, currentPage])
 


 

  return (  
    <div className="section main-page">
      
      <Drawer title={modalType === 'add' ? t('add__client') : t('update_client')} placement="right" visible={open} onClose={() => setOpen(false)}>
        <Content modalType={modalType} currentClient={currentClient} setOpen={() => setOpen()} />
      </Drawer>
      <h1 className="heading">{t('clients')}</h1>

      <div className="content">
          <div className="content-top">
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form__input wdith_3"
                placeholder={t('search')}
              />
              <Button className="btn btn-primary btn-md" onClick={() => {
                setOpen(true)
                setModalType('add')
              }}><i className="bx bx-plus"></i> {t('add__client')}</Button>
          </div>

          <div className="content-body">

        <Skeleton loading={loading} active >
          <Table 
            className="content-table"
            dataSource={dataSource && dataSource}
            columns={columns} 
            pagination={false}
            />
          </Skeleton> 

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
    </div>
  )
}

export default Clients
