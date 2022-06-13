import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton, Modal } from 'antd'
import React, { useState, useEffect } from 'react' 

import axios from 'axios';

import moment from 'moment';

import {setToken, URL} from '../../assets/api/URL';

import { useTranslation } from 'react-i18next';

const Baskets = () => {  
    const [loading, setLoading] = useState(true) 
    const [search, setSearch] = useState('')

    const [baskets, setBaskets] = useState([])

    const [from, setFrom] = useState('2020-01-01')
    const [to, setTo] = useState(moment(Date.now()).format('YYYY-MM-DD'))

    const { t } = useTranslation()

    const [open, setOpen] = useState(false); 
    const [currentBasketId, setCurrentBasketId] = useState('');
    const [currentSelectedBasket, setCurrentSelectedBasket] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [productDetailsIsOpen, setProductDetailsIsOpen] = useState(false);
    useEffect(() => {
        setLoading(true) 

        fetch(`${URL}/api/payment/history/?from=${from !== '' ? from : '2020-01-01'}&to=${to}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " +localStorage.getItem('token')
            },
        }).then(res => res.json())
        .then(data => {
            setBaskets(data.payload.data.histories)
            setLoading(false)
        })
        
    } ,[from, to])



    const dataSource = []; 
    baskets?.map(item => {
        dataSource.push({
            key: item?.payment_id,
            name: <div className="table-title"> <h2>{item?.client.name}</h2></div>,
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
        },
        {
          title: t('date'),
          dataIndex: 'date',
          key: 'key'
      }
      ];

 
 

  return (
    <div>
      <div className="section main-page"> 



      {/* MODAL WINDOW */}
      {!open && productDetailsIsOpen ? (
        <Modal
          footer={null}
          visible={productDetailsIsOpen}
          onCancel={() => {
            setProductDetailsIsOpen(false);
            setProductDetails({});
          }}
        >
          <h2>{productDetails?.client.name}</h2>
          <table className="product__details-table">
            <tbody className="product__details-table__body">
              <tr>
                <td>{t("fio")}</td>
                <td>
                  {productDetails.client.name}
                </td>
              </tr>
              <tr>
                <td>{t("cash")}</td>
                <td>
                  <span>{productDetails?.amount_paid.cash ? productDetails?.amount_paid.cash.toLocaleString() : null}</span>
                </td>
              </tr>
              <tr>
                <td>{t("card")}</td>
                <td>
                  {productDetails?.amount_paid.card !== null ? productDetails?.amount_paid.card.toLocaleString() : null} 
                </td>
              </tr>
              <tr>
                <td>{t("total_income")}</td>
                <td>
                  {(productDetails?.amount_paid.card + productDetails?.amount_paid.cash) !== null ? (productDetails?.amount_paid.card + productDetails?.amount_paid.cash).toLocaleString() : null}
                </td>
              </tr> 
              <tr>
                <td>{t("seller")}</td>
                <td>
                  {productDetails?.employee.name}
                </td>
              </tr>   
            </tbody>
          </table> 
        </Modal>
      ) : null}



      <h1 className="heading">{t('clients')}</h1>

      <div className="content">
          <div className="content-top">
          <div className="content-top__group">

            <DatePicker
            clearIcon={false}
              className="content__range-picker content-top__input form__input pl-1"
              placeholder={t('from')}
              onChange={(value, string) => {
                setFrom(string)
              } }
              value={moment(from)}
              />


            <DatePicker
            clearIcon={false}
              className="content__range-picker content-top__input form__input  pl-1"
              placeholder={t('from')}
              onChange={(value, string) => {
                setTo(string)
              } }
              value={moment(to)}
              />
              </div> 
          </div>

          <div className="content-body">

          <Skeleton loading={loading} active table>
          <Table 
            className="content-table lg-table"
            dataSource={dataSource && dataSource}
            columns={columns} />


            <div className="responsive__table">
              {baskets &&
                baskets.length > 0 &&
                baskets.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item"
                      key={index}
                      onClick={(e) => {
                        !(e.target.classList.value.includes("bx")) && 
                          setProductDetailsIsOpen(true); 
                          setProductDetails(item);
                      }}
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{item?.client.name}</h3>
                        <h4>{(item?.amount_paid.card + item?.amount_paid.cash).toLocaleString()}</h4> 
                      </div> 
                      <div> 

                      <span className='text-xs align-left'>{item?.paid_time}</span> 
                      </div>
                    </div>
                  );
                })}
            </div>
          </Skeleton>
          </div>
      </div>
    </div>
    </div>
  )
}

export default Baskets
