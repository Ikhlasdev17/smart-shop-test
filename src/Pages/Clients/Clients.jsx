import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton, Pagination, Modal } from 'antd'
import Content from './Content';
import React, { useState, useEffect } from 'react' 
import { useSelector, useDispatch } from 'react-redux';
import { fetchingClients, fetchedClients, clientsFetchingError } from '../../redux/clientsReducer';
import './Clients.scss';


import axios from 'axios';

import {setToken, URL} from '../../assets/api/URL';

import { useTranslation } from 'react-i18next';
import { DebounceInput } from 'react-debounce-input';

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
  const [currentPage, setCurrentPage] = useState(1)


  const [clientDetailsIsOpen, setClienDetailsIsOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState({});



  const dataSource = [];


    clients?.map(item => { 
      dataSource.push({
        key: item.id,
        name: <div className="table-title"> <h2>{item.full_name}</h2> <p>{item.phone.length > 9 ?  item.phone : `+998${item.phone}` }</p></div>,
        balance: item.balance !== null && item.balance.toLocaleString(),
        stir: item.tin ? item.tin.toLocaleString() : 'Jismoniy Shaxs',
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
      setLastPage(res.data.payload.last_page)
      setPerPage(res.data.payload.per_page)
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
      dispatch(clientsFetchingError())
    })
  } ,[open, search, currentPage])
 



 if(clientsFetchingStatus === 'error'){
    return <div>Error</div>
  }

  return (  
    <div className="section main-page">
      
      <Drawer title={modalType === 'add' ? t('add__client') : t('update_client')} placement="right" visible={open} onClose={() => setOpen(false)}>
        <Content modalType={modalType} currentClient={currentClient} setOpen={() => setOpen()} />
      </Drawer>


      {!open && clientDetailsIsOpen ? (
        <Modal
          footer={null}
          visible={clientDetailsIsOpen}
          onCancel={() => {
            setClienDetailsIsOpen(false);
            setClientDetails({});
          }}
        >
          <h2>{clientDetails?.name}</h2>
          <table className="product__details-table">
            <tbody className="product__details-table__body">
              <tr>
                <td>{t("fio")}</td>
                <td>
                  {clientDetails.full_name}
                </td>
              </tr>
              <tr>
                <td>{t("balance")}</td>
                <td>
                  {<span style={clientDetails.balance < 0 ? {color: '#eb6767'} : {color: '#6767eb'}}>{clientDetails.balance !== null && clientDetails.balance.toLocaleString()}</span>} 
                </td>
              </tr>
              <tr>
                <td>{t("stir")}</td>
                <td>
                  {clientDetails.tin ? clientDetails.tin.toLocaleString() : 'Jismoniy Shaxs'} 
                </td>
              </tr>
              <tr>
                <td>{t("about__client")}</td>
                <td>
                  {clientDetails?.about}
                </td>
              </tr> 
            </tbody>
          </table> 
        </Modal>
      ) : null}


      <h1 className="heading">{t('clients')}</h1>

      <div className="content">
          <div className="content-top">
              <DebounceInput
                debounceTimeout={800}
                minLength={2} 
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
            className="content-table lg-table"
            dataSource={dataSource && dataSource}
            columns={columns} 
            pagination={false}
            />


          <div className="responsive__table">
              {clients &&
                clients.length > 0 &&
                clients.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        !(e.target.classList.value.includes("bx")) && 
                          setClienDetailsIsOpen(true); 
                          setClientDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.full_name}</h3>
                        <h4>{item.phone.length > 9 ?  item.phone : `+998${item.phone}` }</h4>
                         
                      </div>
                      
                      <div>

                        <div className="responsive__table-item__details-actions">
                          <div className="table-button__group">
                          <>
                            <Button className="table-action" onClick={() => {
                              setOpen(!open)
                              setCurrentClient(item)
                              setModalType('update')
                            }}><i className="bx bx-edit"></i></Button>
                          </>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>




          </Skeleton> 

          {lastPage > 1 && (
              <div className="pagination__bottom">
              <Pagination 
                total={lastPage * perPage} 
                pageSize={perPage || 60}
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
