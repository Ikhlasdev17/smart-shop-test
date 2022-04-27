import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react' 

import axios from 'axios';

import moment from 'moment';

import {setToken, URL} from '../../assets/api/URL';
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';

import { useTranslation } from 'react-i18next';

const Baskets = () => {  
    const [loading, setLoading] = useState(true) 
    const [search, setSearch] = useState('')

    const [baskets, setBaskets] = useState([])

    const [from, setFrom] = useState('2020-01-01')
    const [to, setTo] = useState(moment(Date.now()).format('YYYY-MM-DD'))

    const { t } = useTranslation()
     
    useEffect(() => {
        setLoading(true) 

        fetch(`${URL}/api/payment/history/?from=${from !== '' ? from : '2020-01-01'}&to=${to !== '' ? to : moment(Date.now()).format('YYYY-MM-DD')}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " +localStorage.getItem('token')
            },
        }).then(res => res.json())
        .then(data => {
            setBaskets(data.payload)
            setLoading(false)
        })
        
    } ,[from, to])



    const dataSource = []; 
    baskets?.map(item => {
        dataSource.push({
            key: item?.payment_id,
            name: <div className="table-title"> <h2>{item?.clinet.name}</h2></div>,
            cash: item?.amount_paid.cash,
            card: item?.amount_paid.card,
            total: item?.amount_paid.card + item?.amount_paid.cash,
            employee: item?.employee.name,
            date: item?.paid_time
        })
    
        }) 

 


    const columns = [
        {
          title: t('clients'),
          dataIndex: 'name',
          key: 'key',
        },
    
        {
          title: t('cash'),
          dataIndex: 'cash',
          key: 'key'
        },
        {
          title: t('card'),
          dataIndex: 'card',
          key: 'key'
        },
    
        {
          title: t('total_income'),
          dataIndex: 'total',
          key: 'key'
        },
    

        {
            title: t('seller'),
            dataIndex: 'employee',
            key: 'key'
        }
      ];

 
 

  return (
    <div>
      <div className="section main-page"> 
      <h1 className="heading">{t('clients')}</h1>

      <div className="content">
          <div className="content-top">
             <DatePicker.RangePicker 
             className="form__input wdith_3"
             onChange={(value, strings) => {
                 setFrom(strings[0])
                 setTo(strings[1])
             }}   
             placeholder={[t('from'), t('to')]}
             />
          </div>

          <div className="content-body">

          <Skeleton loading={loading} active table>
          <Table 
            className="content-table"
            dataSource={dataSource && dataSource}
            columns={columns} />
          </Skeleton>
          </div>
      </div>
    </div>
    </div>
  )
}

export default Baskets
