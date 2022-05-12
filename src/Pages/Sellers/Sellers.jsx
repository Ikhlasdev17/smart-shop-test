import React, { useEffect, useState } from 'react'
import './Sellers.scss';
import { Drawer, Select, Button, Table, Space, Skeleton, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchedSellers, fetchingSellers, fetchingErrorSellers } from '../../redux/sellersSlice';
import { setToken, URL } from '../../assets/api/URL';
import axios from 'axios';
import swal from 'sweetalert';
import Content from './Content';
import History from './History';

import { useTranslation } from 'react-i18next';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const { Option } = Select 

const Sellers = () => {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const { sellers, sellersFetchingStatus } = useSelector(state => state.sellersReducer)
    const [loading, setLoading] = useState(true)
    const [modalType, setModalType] = useState('')
    const [currentID, setCurrentID] = useState('')
    const [currentSeller, setCurrentSeller] = useState({})
    const { t } = useTranslation()
    
    const [refresh, setRefresh] = useState(1)


    const dataSource = [];


    const [sellerDetailsIsOpen, setSellerDetailsIsOpen] = useState(false);
    const [sellerDetails, setSellerDetails] = useState({});


    // ati, jumis haqi, FLEX, tariyxi, hareket

    sellers?.map(item => {
        if (item.role !== "ceo") {
            dataSource.push({
                key: item.id,
                name: <div className="product__table-product">
                <div className="product__table-product__image">
                    {
                        item?.avatar !== null ?(
                            <img style={{borderRadius: '50%', objectFit: 'cover'}} src={item?.avatar} alt="Product Photo" /> 
                        ) : (
                            <img style={{borderRadius: '50%'}} src={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'} alt="Product Photo" /> 
                        )
                    } 
                </div>
                <div className="product__tabel-product_name">
                    <h3>{item?.name}</h3>
                </div>
            </div>,
                balance: item.salary !== null ? item.salary.toLocaleString() : 0,
                flex: item.flex || 0 + ' %',
                history: <Button className="table-action" onClick={() => {
                    setOpen(!open)
                    setModalType('history')
                    setCurrentID(item.id)
                }}><i className="bx bx-copy"></i></Button>,
                action: (
                <div className='table-button__group'>
                    <Button className="table-action" onClick={() => {
                        setOpen(!open)
                        setModalType('update')
                        setCurrentSeller(item)
                        }}><i className='bx bx-money-withdraw'></i></Button>
    
                    <Button className="table-action" onClick={() => {
                        setOpen(!open)
                        setModalType('update_user_data')
                        setCurrentSeller(item)
                        }}><i className='bx bx-edit'></i></Button>
                </div>
            )
            })
        }
    })


    let columns;
 
    if (localStorage.getItem('role') === 'ceo'){

        columns = [
            {
          title: t('sellers'),
          dataIndex: 'name',
          key: 'key',
        },
        
        {
          title: t('ish_haqi'),
          dataIndex: 'balance',
          key: 'key'
        },
    
        {
          title: 'FLEX',
          dataIndex: 'flex',
          key: 'key'
        },
    
        {
          title: t('ish_tarixi'),
          dataIndex: 'history',
          key: 'key'
        },
    
        {
          title: t('action'),
          dataIndex: 'action',
          key: 'key'
        }
    ];
    } else {
        columns = [
            {
          title: t('sellers'),
          dataIndex: 'name',
          key: 'key',
        }
        ]
    }
    

    //   fetching sellers from api 
    useEffect(async() => {
        dispatch(fetchingSellers())

        const res = await axios.get(`${URL}/api/employees`, setToken())

        if (res.status === 200) {
            dispatch(fetchedSellers(res.data.payload))
            setLoading(false)
            console.warn(res.data.payload)
        } else {
            setLoading(false)
            dispatch(fetchingErrorSellers())
        }
     }, [open])

    return (
        <div className="section main-page">
        
        <Drawer title={modalType === 'add' ? t('satiwshi_qosiw') : modalType === 'update' ? t('ish_haqini_hisoblash') : modalType === 'change_all_salary' ? t('ish_haqini_hisoblash') : t('satiwshini_janalaw') } placement="right" visible={open} onClose={() => setOpen(false)}>
            {modalType === 'history' ? <History currId={currentID} /> : <Content open={open} setRefresh={() => setRefresh()} currentSallary={modalType !== "add" && currentSeller} modalType={modalType} setOpen={setOpen} type={modalType} refresh={refresh}/>}
        </Drawer>

        {localStorage.getItem('role') === 'ceo' && !open && sellerDetailsIsOpen ? (
        <Modal
          footer={null}
          visible={sellerDetailsIsOpen}
          onCancel={() => {
            setSellerDetailsIsOpen(false);
            setSellerDetails({});
          }}
        >
          <h2>{sellerDetails?.name}</h2>
          <table className="product__details-table">
            <tbody className="product__details-table__body">
              <tr>
                <td>{t("ish_haqi")}</td>
                <td>
                  {sellerDetails.salary !== null ? sellerDetails.salary.toLocaleString() : 0}
                </td>
              </tr>
              <tr>
                <td>{t("FLEX")}</td>
                <td>
                  {sellerDetails.flex || 0 + ' %'} 
                </td>
              </tr>
            </tbody>
          </table>

          <div className="product__detail-image">
            {sellerDetails?.avatar !== null && (
              <img src={sellerDetails?.avatar} alt="product" />
            )}
          </div>
        </Modal>
      ) : null}

        <h1 className="heading">{t('sellers')}</h1>

        <div className="content">
            <div className="content-top">
                {
                    localStorage.getItem('role') === 'ceo' && (
                        <Button className="btn btn-primary btn-md"
                    onClick={e => {
                        setModalType('change_all_salary')
                        setOpen(true)
                    }}
                ><i className="bx bx-edit"></i> {t('ish_haqini_hisoblash')}</Button>
                    )
                }
                <Button className="btn btn-primary btn-md" onClick={() => {
                    setCurrentSeller("")
                    setModalType('add')
                    setOpen(true);
                }}><i className="bx bx-plus"></i>{t('satiwshi_qosiw')}</Button>
            </div>

            <div className="content-body">

                <Skeleton loading={loading} active>
            <Table
                size="small"
                className="content-table lg-table"
                dataSource={dataSource}
                columns={columns}
                />

            

            <div className="responsive__table">
              {sellers &&
                sellers.length > 0 &&
                sellers.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        !(e.target.classList.value.includes("bx")) && 
                          setSellerDetailsIsOpen(true); 
                          setSellerDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.name}</h3>
                        <h4>{item.salary !== null ? item.salary.toLocaleString() : 0}</h4>
                         
                      </div>
                      
                      <div>

                        <div className="responsive__table-item__details-actions">
                          <div className="table-button__group">
                          <>
                          <Button className="table-action" onClick={() => {
                                setOpen(!open)
                                setModalType('update')
                                setCurrentSeller(item)
                                }}><i className='bx bx-money-withdraw'></i></Button>
            
                            <Button className="table-action" onClick={() => {
                                setOpen(!open)
                                setModalType('update_user_data')
                                setCurrentSeller(item)
                                }}><i className='bx bx-edit'></i></Button>
                          </>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>


            </Skeleton>
            </div>
        </div>
        </div>
    )
}

export default Sellers
