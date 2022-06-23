import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Input, InputNumber, message, Pagination, Select, Skeleton, Table } from 'antd'
import { URL, setToken } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom';
import { useTranslation } from 'react-i18next';
import { DebounceInput } from 'react-debounce-input';

const ReturnOrder = () => {
    const [orders, setOrders] = useState([])
    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()
    const [search, setSearch] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [dataForReturn, setData] = useState([])
    const [lastPage, setLastPage] = useState();
    const [perPage, setPerPage] = useState();
    const [page, setPage] = useState(1);
    
    useEffect(() =>{
        setLoading(true)
        axios.get(
          `${URL}/api/products?search=${search}&page=${page}&search=${search}`,
          setToken()
        )
        .then(res => {
            setOrders(res.data.payload.data)
            setLoading(false)
            setLastPage(res.data.payload.last_page)
            setPerPage(res.data.payload.per_page)
        })
    }, [fetching, search, page])


    const dataSource = [];



    const onChange =  (value, item) => {
        if (value > item.count ){
            setBtnDisabled(true)
            message.warning('Mahsulot soni yetarli emas!')
        } else {
            setBtnDisabled(false)
        }


        if (value === null){
            const newItem = dataForReturn.filter(x => x.product_id !== item.id)
            setData(newItem)
        } else {

        const index = dataForReturn.findIndex(x => x.product_id === item.id)

        if (index === -1) {
          setData([...dataForReturn, {
            product_id: item.id,
            count: value
          }])
        } else {
          const newItems = [...dataForReturn]
          newItems[index].count = value
          setData(newItems)

        }
      } 

    }


    useEffect(() => {
        if (dataForReturn.length > 0) {
            setBtnDisabled(false)
        } else {
            setBtnDisabled(true)
        } 
    }, [dataForReturn])



    const sendToReturn = () => {
        axios.post(`${URL}/api/warehouse/return`, dataForReturn, setToken())
        .then(res => {
            message.success(t('muaffaqiyatli'))
            setFetching(!fetching)
            setData([])
        })
    }



  orders?.map(item => {
    dataSource.push({
      key: item?.id,
      product: <div className="product__table-product">
          <div className="product__table-product__image"> 
              <Zoom>
                <img src={item?.image && item?.image !== null ? item?.image : 'https://seafood.vasep.com.vn/no-image.png'} alt="Product Photo" /> 
              </Zoom>
          </div>
          <div className="product__tabel-product_name">
              <h3>{item?.name}</h3>
          </div>
      </div>,
      count: item?.warehouse?.count !== null ? item?.warehouse?.count : '0',
      addCount: <div className="form-group">
        <InputNumber size="small" className="form__input form-group__item table_input" onChange={(e) => {
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
      <h1 className="heading">{t('return')}</h1>
      

      <div className="content">
          <div className="content-top">
              <DebounceInput 
                minLength={2}
                debounceTimeout={800} placeholder={t('search')} className="form__input wdith_3" 
                onChange={(e) => {
                  setPage(1)
                  setSearch(e.target.value)}} />

              <Button disabled={btnDisabled} onClick={() =>sendToReturn()}className="btn btn-primary">{t('saqlash')}</Button>
          </div>


          <div className="content-body" >
          <Skeleton loading={loading} active> 
          <Table  className="content-table" dataSource={dataSource} columns={columns} pagination={false} />
          </Skeleton>
          {lastPage > 1 && (
            <div className="pagination__bottom">
              <Pagination
                total={lastPage * perPage}
                pageSize={perPage ? perPage : 0}
                current={page}
                onChange={(c) => {
                  setPage(c)
                }}
                showSizeChanger={false}
              />
            </div>
          )}
          </div>
      </div>
    </div>
    )
}


export default ReturnOrder