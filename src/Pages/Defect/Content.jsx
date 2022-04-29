import { Button, Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';

const Content = ({ currentBasket }) => {
    const {t} = useTranslation()

  
    const dataSource = [];


    currentBasket?.items?.map(item => {
      dataSource.push({
        key: item?.item_id,
        product: <strong>{item?.product_name}</strong>,
        count: item?.count, 
        })
    })
    
    const columns = [
      {
        title: t('products'),
        dataIndex: 'product',
        key: 'key',
      },
      {
        title: t('count'),
        dataIndex: 'count',
        key: 'key',
      }
    ];


  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default Content
