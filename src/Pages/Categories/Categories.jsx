import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react' 
import { useSelector, useDispatch } from 'react-redux';
import Content from './Content';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {setToken, URL} from '../../assets/api/URL';
import { fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';
const {Option} = Select;
const Categories = () => {
    const [open, setOpen] = useState()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const {categories, categoriesFetchingStatus} = useSelector(state => state.categoriesReducer)
    const [modalType, setModalType] = useState('')
    const [currentCategory, setCurrentCategory] = useState({})
    const [search, setSearch] = useState('')
    const { t } = useTranslation()
    const dataSource = [];

 
        categories?.map(item => {
            dataSource.push({
              key: item.id,
              name: <div className="table-title"> <h2>{item.name}</h2></div>,
              whole_percent: item.whole_percent,
              min_percent: item.min_percent,
              max_percent: item.max_percent,
              min_product: item.min_product,
              action: (
                <>
                  <Button className="table-action" onClick={() => {
                      setCurrentCategory(prev => item)
                      setModalType('update')
                      setOpen(!open)
                  }}><i className="bx bx-edit"></i></Button>
                  <Button className="table-action"><i className="bx bx-trash"></i></Button>
                </>
              )
            })
      
          }) 

 


    const columns = [
        {
          title: t('categories'),
          dataIndex: 'name',
          key: 'key',
        },
    
        {
          title: t('ulgurji_foiz'),
          dataIndex: 'whole_percent',
          key: 'key'
        },
        {
          title: t('minimum_foiz'),
          dataIndex: 'min_percent',
          key: 'key'
        },
    
        {
          title: t('maksumum_foiz'),
          dataIndex: 'max_percent',
          key: 'key'
        },
    

        {
            title: t('minimum_mahsulot'),
            dataIndex: 'min_product',
            key: 'key'
        },
    
        {
          title: t('action'),
          dataIndex: 'action',
          key: 'key'
        }
      ];



    useEffect(async () => {
        dispatch(fetchingCategories())

        const res = await axios.get(`${URL}/api/categories?search=${search}`, setToken());
        setLoading(true)
        if (res.status === 200) {
            dispatch(fetchedCategories(res.data.payload))
            setLoading(false)
        } else {
            dispatch(fetchingErrorCategories())
        }
        
    }, [search])

 

  return (
    <div>
      <div className="section main-page">
      
      <Drawer title={modalType === 'add' ? t('kategoriya_qoshish') : t('kategoriyani_yangilash')} placement="right" visible={open} onClose={() => setOpen(false)}>
        <Content setOpen={() => setOpen()} type={modalType} currentCategory={currentCategory} />
      </Drawer>
      <h1 className="heading">{t('categories')}</h1>

      <div className="content">
          <div className="content-top">
             <Input 
              placeholder={t('kategoriya_nomi')}
              onChange={(e) => setSearch(e.target.value)}
              className="form__input wdith_3"
              style={{width: '30rem'}}
               />
              <Button className="btn btn-primary btn-md" onClick={() => {
                  setOpen(true)
                  setModalType('add')
                  }}><i className="bx bx-plus"></i> {t('kategoriya_qoshish')}</Button>
          </div>

          <div className="content-body">
            <Skeleton loading={loading} active>

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

export default Categories
