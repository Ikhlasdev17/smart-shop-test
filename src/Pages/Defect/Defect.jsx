import { Select,DatePicker, Table, Button, Drawer } from 'antd'
import React, { useState, useEffect } from 'react'
import ModalAction from '../../components/ModalAction/ModalAction';

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import './Defect.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import moment from 'moment'
import Content from './Content';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const {Option} = Select;

const Defect = () => {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.productsReducer) 
  const [ defectProducts, setDefectProducts ] = useState([])
  const now = Date.now()
  const [from, setFrom] = useState('2020-12-10')
  const [to, setTo] = useState(moment(now).format('YYYY-MM-DD')) 
  const [open, setOpen] = useState(false)
  const [currentBasket, setCurrentBasket] = useState({})
  const { t } = useTranslation()

  useEffect(async () => {
    dispatch(fetchingProducts());

    const response = await axios.get(`${URL}/api/warehouse/defect`, setToken())

    if (response.status === 200) {
      setDefectProducts(response.data.payload)
    }

  } ,[from, to])



  const dataSource = [];

  defectProducts?.map(item => {
    dataSource.push({
      key: item?.product_id,
      product: <strong>{item?.basket_id}</strong>,
      count: item?.items.length,
      action: <>
        <Button className="table-action" onClick={() => {
                    setOpen(!open)
                    setCurrentBasket(item)
        }}><i className="bx bx-copy"></i></Button>
      </>
    })
  })

  console.error(defectProducts)
  
  const columns = [
    {
      title: 'Toplam №',
      dataIndex: 'product',
      key: 'key',
    },
    {
      title: 'Mahsulot soni',
      dataIndex: 'count',
      key: 'key',
    },
    {
      title: 'Harakat',
      dataIndex: 'action',
      key: 'key',
    }
  ];
 

  return (
    
    <div className="section main-page">
      <Drawer visible={open} onClose={() => setOpen(false)} title="Yaroqsiz mahsulotlar">
        <Content currentBasket={currentBasket} />
      </Drawer>
      <h1 className="heading">{t('defect')}</h1>

      <div className="content">
          <div className="content-top">
          </div>


          <div className="content-body" >
          <Table  className="content-table" dataSource={dataSource} columns={columns} />
          </div>
      </div>
    </div>
  )
}

export default Defect
