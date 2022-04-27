import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Input, InputNumber, message, Select, Skeleton, Table } from 'antd'
import { URL, setToken } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom';
import { useTranslation } from 'react-i18next';

const ReturnOrder = () => {
    const [orders, setOrders] = useState([])
    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()
    const [search, setSearch] = useState('')
    const dataForReturn = []

    useEffect(() =>{
        setLoading(true)
        axios.get(`${URL}/api/warehouse?search=${search} `, setToken())
        .then(res => {
            setOrders(res.data.payload.data)
            setLoading(false)
        })
    }, [fetching, search])


    const dataSource = [];



    const onChange =  (value, item) => {

        if (value > item.count){
            message.warning('Mahsulot soni yetarli emas!')
            value = item.count
        }

        const index = dataForReturn.findIndex(x => x.product_id === item.product.id)

        if (index === -1) {
            dataForReturn.push({
                product_id: item.product.id,
                count: value
            })
        } else {
            dataForReturn[index].count = value
        }

        console.info(index)
    }



    const sendToReturn = () => {
        axios.post(`${URL}/api/warehouse/return`, dataForReturn, setToken())
        .then(res => {
            message.success(t('muaffaqiyatli'))
            setFetching(!fetching)
        })
    }


  orders?.map(item => {
    console.info()
    dataSource.push({
      key: item?.product.id,
      product: <div className="product__table-product">
          <div className="product__table-product__image"> 
              <Zoom>
                <img src={item?.product.image && item?.product.image !== null ? item?.product.image : 'https://seafood.vasep.com.vn/no-image.png'} alt="Product Photo" /> 
              </Zoom>
          </div>
          <div className="product__tabel-product_name">
              <h3>{item?.product.name}</h3>
          </div>
      </div>,
      count: item?.count,
      addCount: <div className="form-group">
        <InputNumber size="small" className="form__input form-group__item table_input" placeholder={item.count} onChange={(e) => {
        onChange(e, item)
      }} /> 
      </div>
    })
  })
  
  const columns = [
    {
      title: t('products'),
      dataIndex: 'product',
      key: 'key',
    },
    {
      title: t('hozir_bor'),
      dataIndex: 'count',
      key: 'key',
    }, 
    {
        title: t('count'),
        dataIndex: 'addCount',
        key: 'key'
    }
  ];


    return ( 
        <div className="section main-page">
      <h1 className="heading">{t('order')}</h1>
      

      <div className="content">
          <div className="content-top">
              <Input placeholder={t('search')} className="form__input" onChange={(e) => setSearch(e.target.value)} />

              <Button onClick={() =>sendToReturn()}className="btn btn-primary">{t('saqlash')}</Button>
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


export default ReturnOrder