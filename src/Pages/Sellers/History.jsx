import { Table } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { URL, setToken } from '../../assets/api/URL'
import moment from 'moment'
import { useTranslation } from 'react-i18next'


const History = ({ currId }) => {
    const [salaries, setSalaries] = useState([])
    const [from, setFrom] = useState('2020-03-12')
    const [to, setTo] = useState(moment(Date.now()).format('YYYY-MM-DD'))
    const { t } = useTranslation()

    const months = [
      {id: 1, name: t('yanvar')},
      {id: 2, name: t('fevral')},
      {id: 3, name: t('mart')},
      {id: 4, name: t('aprel')},
      {id: 5, name: t('may')},
      {id: 6, name: t('iyun')},
      {id: 7, name: t('iyul')},
      {id: 8, name: t('avgust')},
      {id: 9, name: t('sentyabr')},
      {id: 10, name: t('oktyabr')},
      {id: 11, name: t('noyabr')},
      {id: 12, name: t('dekabr')},
    ]
    const dataSource = []

    salaries.map(item => {
      dataSource.push({
        name: <span>
          <strong>{ months[item.month - 1].name}</strong>
          <p>{item.year}</p>
        </span>,
        price: item.sum

      })
    })

    const columns = [
        {
            title: t('date'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('sum'),
            dataIndex: 'price',
            key: 'key',
        },
    ];





    useEffect(() => { 
        axios.get(`${URL}/api/salary/monthly/employee/?employee_id=${currId}&from=${from}&to=${to}`, setToken())
        .then(res => setSalaries(res.data.payload))
    } ,[currId])


  return (
    <div>
      <Table size="small" dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default History
