import React, { useEffect, useState } from 'react'
import './Sellers.scss';
import { Drawer, Select, Button, Table, Space, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchedSellers, fetchingSellers, fetchingErrorSellers } from '../../redux/sellersSlice';
import { setToken, URL } from '../../assets/api/URL';
import axios from 'axios';
import swal from 'sweetalert';
import Content from './Content';
import History from './History';

import { useTranslation } from 'react-i18next';

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

    // ati, jumis haqi, FLEX, tariyxi, hareket

    sellers?.map(item => {
        dataSource.push({
            key: item.id,
            name: <div className="table-title"> <h2>{item.name}</h2> <p>{item.phone}</p></div>,
            balance: item.salary !== null ? item.salary.toLocaleString() : 0,
            flex: item.flex || 0 + ' %',
            history: <Button className="table-action" onClick={() => {
                setOpen(!open)
                setModalType('history')
                setCurrentID(item.id)
            }}><i className="bx bx-copy"></i></Button>,
            action: (
            <>
                <Button className="table-action" onClick={() => {
                    setOpen(!open)
                    setModalType('update')
                    setCurrentSeller(item)
                    }}><i className="bx bx-edit"></i></Button>
            </>
        )
        })
    })
 

    const columns = [
        {
          title: t('seller'),
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
        
        <Drawer title={modalType === 'add' ? t('satiwshi_qosiw') : modalType === 'update' ? t('satiwshini_janalaw') : modalType === 'change_all_salary' ? t('ish_haqini_hisoblash') : '' } placement="right" visible={open} onClose={() => setOpen(false)}>
            {modalType === 'history' ? <History currId={currentID} /> : <Content setRefresh={() => setRefresh()} currentSallary={currentSeller} modalType={modalType} setOpen={setOpen} type={modalType} refresh={refresh}/>}
        </Drawer>
        <h1 className="heading">{t('sellers')}</h1>

        <div className="content">
            <div className="content-top">
                <Button className="btn btn-primary btn-md"
                    onClick={e => {
                        setModalType('change_all_salary')
                        setOpen(true)
                    }}
                ><i className="bx bx-edit"></i> {t('ish_haqini_hisoblash')}</Button>
                <Button className="btn btn-primary btn-md" onClick={() => {
                    setModalType('add')
                    setOpen(true);
                }}><i className="bx bx-plus"></i>{t('satiwshi_qosiw')}</Button>
            </div>

            <div className="content-body">

                <Skeleton loading={loading} active>
            <Table
                size="small"
                className="content-table"
                dataSource={dataSource}
                columns={columns}
                />
            </Skeleton>
            </div>
        </div>
        </div>
    )
}

export default Sellers
