import { Select,DatePicker, Table, Button, Input, Drawer, Skeleton, InputNumber, message, Pagination } from 'antd'
import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../../redux/productsSlice';

import './Products.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../../assets/api/URL'
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../../redux/categoriesSlice';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useTranslation } from 'react-i18next';
import swal from 'sweetalert';
const { RangePicker } = DatePicker;
const {Option} = Select;

const Products = () => {
  const dispatch = useDispatch()
  const [category,setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const { categories } = useSelector(state => state.categoriesReducer)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  let defectProducts = []
  const count = useRef()  
  const [showTable, setShowTable ] = useState(false)
  const [totalPrices, setTotalPrices] = useState({})

  const [lastPage, setLastPage] = useState()
  const [perPage, setPerPage] = useState()
  const [currentPage, setCurrentPage] = useState()



  useEffect(async () => {
    dispatch(fetchingCategories())

    setLoading(true)

    await axios.get(`${URL}/api/categories`, setToken())
    .then(res => {
      dispatch(fetchedCategories(res.data.payload))
      setLoading(false)
    })


    await axios.get(`${URL}/api/warehouse/cost-price`, setToken())
    .then(res => setTotalPrices(res.data.payload))
    
    }, []) 


    const handleChange = (e, id, count) => {
      const index = defectProducts.findIndex(item => item.product_id === id)

      if(e <= count){
        if (index < 0){
          defectProducts.push({
            product_id: id,
            count: e
          })
        } else {
          defectProducts[index].count = e
        }
      } else {
        swal({
          title: 'Mahsulot sonidan katta son kiritmang!',
          icon: 'warning'
        })
      }
    }



    const sendToDefect = () => {
      setShowTable(true)
      message.loading({
        duration: 1,
        content: t('kuting')
      })
      axios.post(`${URL}/api/warehouse/defect`, defectProducts, setToken())
      .then(res => {
        setShowTable(false)
        message.success({
          duration: 3,
          content: t('muaffaqiyatli')
        })
      })
    }




  
    const dataSource = [];


    
    products.length > 0 && products?.map(item => {
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
        category: item?.category.name,
        count: item?.count,
        defect: <><InputNumber ref={count} onChange={(e) => {
          handleChange(e, item?.product.id, item?.count)
        }} /></>  
      })
    })
    
    const columns = [
      {
        title: t('products'),
        dataIndex: 'product',
        key: 'category',
      },
      {
        title: t('categories'),
        dataIndex: 'category',
        key: 'count',
      }, 
      {
          title: t('hozir_bor'),
          dataIndex: 'count',
          key: 'key'
      },
      {
        title: t('yaroqsiz_mahsulotlar_soni'),
        dataIndex: 'defect',
        key: 'defect'
      }
    ];
  

    
    
    useEffect(async () => {
      dispatch(fetchingProducts());
      
      const response = await axios.get(`${URL}/api/warehouse?search=${search}&page=${currentPage}`, setToken())
      
      if (response.status === 200) {
        setPerPage(response.data.payload.per_page)
        setProducts(response.data.payload.data)
        setLastPage(response.data.payload.last_page)
      }
    } ,[showTable, search, category, currentPage])
    
    console.info(perPage)
 

  return (
    <div className="section products-page"> 

      <div className="top__elements">
      <h1 className="heading">{t('products')}</h1>

      <div className="top__elements-right">
        <span><strong>UZS: </strong>{totalPrices.uzs ? totalPrices.uzs.toLocaleString() : 0}</span>
        <span><strong>USD: </strong>{totalPrices.usd || 0}</span> 
      </div>
      </div>

      <div className="content">
          <div className="content-top">
              <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder="Kategoriyalar"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => setCategory(e)}
              value={category}
              >

                <Option value={''}>{t('barcha_mahsulotlar')}</Option>
                  {
                    categories.map((category) => {
                      return (
                        <Option value={category.id}>{category.name}</Option>
                      )
                    })
                  }
              </Select>

              <Input 
                placeholder={t('search')}
                onChange={e => setSearch(e.target.value)}
                className="form__input wdith_3"
              />

              <Button className="btn btn-primary" onClick={sendToDefect}>{t('save')}</Button>
              
          </div>


          <div className="content-body" >
            <Skeleton loading={loading} active>
              {showTable ? '' : 
              <Table pagination={false} className="content-table"  dataSource={dataSource} columns={columns} />
              }
            </Skeleton>
          </div>

          {lastPage > 1 && (
              <div className="pagination__bottom">
              <Pagination
                total={lastPage * perPage} 
                pageSize={perPage || 50}
                defaultCurrent={currentPage}
                onChange={c => setCurrentPage(c)}
                showSizeChanger={false}
              />
            </div>
          )}
      </div>
    </div>
  )
}

export default Products
