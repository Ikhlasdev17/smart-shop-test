import { Button, InputNumber, message, Skeleton, Table, Checkbox  } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { setToken, URL } from '../../assets/api/URL'
import { useTranslation } from 'react-i18next'

const Content = ({ setOpen, currentBasketItemId, orders }) => {
    const [basketItems, setBasketItems] = useState([])
    const [checkStrictly, setCheckStrictly] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [selectedItemsArr, setSelectedItems] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const {t} = useTranslation()
    const dataToBasket = [
        {
            "basket_id": currentBasketItemId,
            "payment_type":[
                "debt", "cash", "card","paid_debt"
            ],
            "orders":[
                {
                    "order_id":2,
                    "count": 2
                }
            ]
        }
    ]


    const [newArr, setNewArr] = useState([])
    const ordersData = [];
    const selectedItems = []

    const [selectedKeys, seSelectedKeys] = useState([])
    const [checkedItems, setCheckedItems] = useState([])

    useEffect(() =>{
        setSpinning(true)
        axios.get(`${URL}/api/orders?basket_id=${currentBasketItemId}`, setToken())
        .then(res => {
            setBasketItems(res.data.payload.orders)
            setSpinning(false)
        })

    } , [currentBasketItemId, tableLoading])

 
 

     

    const handleChangeBasketItem = (value, item) => { 
        const index = newArr.findIndex(i => i.order_id === item.id)  
        if (value > item.count) {
            message.error(t('malumotni_togri_kiriting'))
            value = item.count
        }
        const newData = [...newArr]
        newData[index].count = value
        setNewArr(newData) 
    }

    const handleClick = () => {
        if (newArr.length === 0) {
            message.error(t('malumotni_togri_kiriting'))
        } else {
            setTableLoading(true)
            axios.post(`${URL}/api/return/orders`, {
                "basket_id": currentBasketItemId,
                "payment_type":[
                    "debt", "cash", "card","paid_debt"
                ],
                orders: newArr
            }, setToken())
            .then(res => {
                console.info(res)
                message.success(t('muaffaqiyatli'))
                setTableLoading(false)
                setOpen(false)
            })
            .catch(err => {
                message.error(t('xatolik'))
            })
        }
    }

    const singleItemChecked = (value, item) => {
        const index = selectedKeys.findIndex(x => x === item.id)

        if (index === -1){
            seSelectedKeys([...selectedKeys, item.id])
            const newItem = {
                order_id: item.id,
                count: item.count
            }

            setNewArr([...newArr, newItem])
            setCheckedItems([...checkedItems, item.id])
        } else {
            const newArray = selectedKeys.filter(x => x !== item.id)
            seSelectedKeys(newArray)
            const newArrayItems = newArr.filter(x => x.order_id !== item.id)
            setNewArr(newArrayItems)

            const newCheckedItems = checkedItems.filter(x => x !== item.id)
            setCheckedItems(newCheckedItems)
        }
    }


    const handleCheckedAll = (e) => {
        setNewArr([])
        setCheckedItems([])
        if (e.target.checked) {
            basketItems.map(item => {
                setCheckedItems(prev => [...prev, item.id])
                seSelectedKeys(prev => [...prev, item.id])
                setNewArr(prev => [...prev, {order_id: item.id, count: item.count}])
            })
        } else { 
            setNewArr([])
            setCheckedItems([])
            seSelectedKeys([]) 
        }
    }


    console.info(newArr)
    


    const dataSource = [];

        basketItems?.map(item => {
            dataSource.push({
                key: item?.id, 
                select: <Checkbox checked={checkedItems.findIndex(x => x === item?.id) !== -1} onChange={(e) => singleItemChecked(e, item)} />,
                product: item?.product_name,
                count: item?.count,
                price: item?.price,
                minus: <>
                   <InputNumber  onChange={(e) => handleChangeBasketItem(e, item)} disabled={selectedKeys?.indexOf(item?.id) === -1} />
                </>
            })
        })


    const columns = [
        {
            title: <Checkbox onChange={e => handleCheckedAll(e)}/>,
            key: 'select',
            dataIndex: 'select'
        },
        {
            title: t('products'),
            key: 'key',
            dataIndex: 'product',
        },
        {
            title: t('count'),
            key: 'soni',
            dataIndex: 'count',
        },
        {
            title: t('sum'),
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: t('minus'),
            key: 'product',
            dataIndex: 'minus',
        },
    ]


  return (
    <div>
      <Skeleton loading={spinning} paragraph={1} active>
      <Table size="small" pagination={false} columns={columns} dataSource={dataSource} />
      </Skeleton>
      <br />
      <Button onClick={handleClick} className="btn btn-primary" style={{float: 'right'}}>Saqlash</Button>

    </div>
  )
}

export default Content
