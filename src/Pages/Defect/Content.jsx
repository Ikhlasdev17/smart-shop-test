import { Button, Table } from 'antd';
import React from 'react'

const Content = ({ currentBasket }) => {


  
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
        title: 'Mahsulot',
        dataIndex: 'product',
        key: 'key',
      },
      {
        title: 'Soni',
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
