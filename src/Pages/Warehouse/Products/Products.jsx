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
import { DebounceInput } from 'react-debounce-input';
const { RangePicker } = DatePicker;
const {Option} = Select;

const Products = () => {
  const dispatch = useDispatch() 
  const [search, setSearch] = useState('')
  const { categories } = useSelector(state => state.categoriesReducer)
  const { products, productsFetchingStatus } = useSelector(
    (state) => state.productsReducer
  );
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  let defectProducts = []
  const count = useRef()  
  const [showTable, setShowTable ] = useState(false)
  const [totalPrices, setTotalPrices] = useState({})

  const [lastPage, setLastPage] = useState()
  const [perPage, setPerPage] = useState()
  const [currentPage, setCurrentPage] = useState(1)

  const [category_id, setCategory_id] = useState("")



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
      if (defectProducts.length > 0) {
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
    } 




  
    const dataSource = [];




    
    products.length > 0 && products?.map(item => {
      const currentCategory = categories.find(category => category.id === item.category.id)
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
        category: currentCategory?.name,
        count: item?.warehouse !== null && item?.warehouse?.count !== null ? item?.warehouse?.count : '0',
        defect: <><InputNumber ref={count} onChange={(e) => {
          handleChange(e, item?.id, item?.warehouse?.count !== null ? item?.warehouse?.count : '0')
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
  
      const response = await axios.get(
        `${URL}/api/products?search=${search}&page=${currentPage}&category_id=${category_id}`,
        setToken()
      );
      setLoading(true);
  
      if (response.status === 200) {
        dispatch(fetchedProducts(response.data.payload.data));
        setLoading(false);
        setLastPage(response.data.payload.last_page);
        setPerPage(response.data.payload.per_page);
      }
    }, [showTable, search, currentPage, category_id]);




    
    useEffect(async () => {
      dispatch(fetchingCategories())

      const res = await axios.get(`${URL}/api/categories`, setToken());
      setLoading(true)
      if (res.status === 200) {
          dispatch(fetchedCategories(res.data.payload))
          setLoading(false)
      } else {
          dispatch(fetchingErrorCategories())
      }
      
  }, [])
 

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
            <div className="content-top__group">
              <Select
              className="form__input content-select content-top__input wdith_3"
              showSearch
              placeholder="Kategoriyalar"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => setCategory_id(e)}
              value={category_id}
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

              <DebounceInput
                minLength={2}
                debounceTimeout={800}
                placeholder={t('search')}
                onChange={e => setSearch(e.target.value)}
                className="form__input wdith_3"
              />
            </div>

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
                current={currentPage}
                currentPage={currentPage}
              />
            </div>
          )}

          <br />
      </div>
    </div>
  )
}

export default Products
