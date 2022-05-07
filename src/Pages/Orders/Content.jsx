import { Button, InputNumber, message, Skeleton, Table, Select, Checkbox  } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { setToken, URL } from '../../assets/api/URL'
import { useTranslation } from 'react-i18next'

const Content = ({ open, setOpen, currentBasketItemId, orders, basket    }) => {
    const [basketItems, setBasketItems] = useState([])
    const [spinning, setSpinning] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const {t} = useTranslation()

    const [btnDisabled, setBtnDisabled] = useState(true)

    const [newArr, setNewArr] = useState([])

    const [selectedKeys, seSelectedKeys] = useState([])
    const [checkedItems, setCheckedItems] = useState([])

    const [payment, setPayment] = useState([])

    useEffect(() =>{
        setSpinning(true)
        axios.get(`${URL}/api/orders?basket_id=${currentBasketItemId}`, setToken())
        .then(res => {
            setBasketItems(res.data.payload.orders)
            setSpinning(false)
        })

    } , [currentBasketItemId, tableLoading])

 
 
    useEffect(() => {
        if (selectedKeys.length === 0) {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
    }, [selectedKeys, checkedItems])
     

    const handleChangeBasketItem = (value, item) => { 
        const index = newArr.findIndex(i => i.order_id === item.id)  
        if (value > item.count) {
            message.error(t('malumotni_togri_kiriting'))
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)

        }
        const newData = [...newArr]
        newData[index].count = value
        setNewArr(newData) 
    }

    const handleClick = () => {
        if (payment.length > 0) {
            if (newArr.length === 0) {
                message.error(t('malumotni_togri_kiriting'))
            } else {
                setTableLoading(true)
                axios.post(`${URL}/api/return/orders`, {
                    "basket_id": currentBasketItemId,
                    "payment_type": payment,
                    orders: newArr
                }, setToken())
                .then(res => {
                    console.info(res)
                    message.success(t('muaffaqiyatli'))
                    setTableLoading(false)
                    setOpen(false)
                    setNewArr([])
                })
                .catch(err => {
                    message.error(t('xatolik'))
                })
            }
        } else {
            message.error(t('malumotni_togri_kiriting'))
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


    useEffect(() => {
        setCheckedItems([])
        setNewArr([])
        seSelectedKeys([]) 
    }, [open])

    const paymentOptions = [
        {
            value: "debt", 
            label: t('qarz')
        },
        {
            value: "card", 
            label: t('card')
        },
        {
            value: "cash", 
            label: t('cash')
        },
        {
            value: "paid_debt", 
            label: t('paid_debt')
        }
    ]


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


    useEffect(() => {
        setPayment([])
        if (payment.length === 0) {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
    }, [open])


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
        <Select
        mode='multiple' 
        style={{width: '100%'}}
        showSearch
        placeholder={t('tolov_turi')}
        optionFilterProp="children"
        filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(e, value) => setPayment(e)}
        value={payment}
        > 
                {
                    paymentOptions.map((item) => {
                        return (
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                )
                })
                }
        </Select> 
        <br />
        <br />
      <Skeleton loading={spinning} paragraph={1} active>
      <Table className='drawer-table' size="small" pagination={false} columns={columns} dataSource={dataSource} />
      </Skeleton>
      <br />
      <Button disabled={btnDisabled} onClick={handleClick} className="btn btn-primary" style={{float: 'right'}}>{t('save')}</Button>
                <br /><br />
        <div>
        <iframe  width="280" height="280" className="qr_code_frame" src={basket.qr_link} title="Bu yerda mahsulotning qr kodi bolishi kerak edi!">

        </iframe>
        </div>
    </div>
  )
}

export default Content
