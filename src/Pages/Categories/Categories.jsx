import { Select,DatePicker, Table, Input, Button, Form, Drawer, Skeleton } from 'antd'
import React, { useState, useEffect } from 'react' 
import { useSelector, useDispatch } from 'react-redux';
import Content from './Content';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {setToken, URL} from '../../assets/api/URL';
import { deleteCategory, fetchedCategories, fetchingCategories, fetchingErrorCategories } from '../../redux/categoriesSlice';
import swal from 'sweetalert';

import Swal from 'sweetalert2';


import {DebounceInput} from 'react-debounce-input';

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
    const [refresh, setRefresh] = useState(false)


    const deleteCategoryFunc = (id) => {
      Swal.fire({
        title: t('delete'), 
        icon: 'warning',
        showCancelButton: true, 
        confirmButtonText: t('yes'),
        cancelButtonText: t('no')
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: t('deleted'),
            icon: 'success'
          })
          dispatch(fetchingCategories())
          axios.delete(`${URL}/api/category/${id}`, setToken())
          .then(res => {
            dispatch(deleteCategory(id))
            setRefresh(!refresh)
          })
        }
      })
      
    }


    categories?.map(item => {
        dataSource.push({
          key: item.id,
          name: <div className="table-title"> <h2>{item.name}</h2></div>,
          whole_percent: item.whole_percent,
          min_percent: item.min_percent,
          max_percent: item.max_percent,
          min_product: item.min_product,
          action: (
            <div className='table-button__group'>
              <Button className="table-action" onClick={() => {
                  setCurrentCategory(prev => item)
                  setModalType('update')
                  setOpen(!open)
              }}><i className="bx bx-edit"></i></Button>
              <Button className="table-action" onClick={e => deleteCategoryFunc(item.id)}><i className="bx bx-trash"></i></Button>
            </div>
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
        
    }, [refresh, search, open])

 

  return (
    <div>
      <div className="section main-page">
      
      <Drawer title={modalType === 'add' ? t('kategoriya_qoshish') : t('kategoriyani_yangilash')} placement="right" visible={open} onClose={() => setOpen(false)}>
        <Content setOpen={() => setOpen()} type={modalType} currentCategory={currentCategory} />
      </Drawer>
      <h1 className="heading">{t('categories')}</h1>

      <div className="content">
          <div className="content-top">
             <DebounceInput 
              placeholder={t('kategoriya_nomi')}
              onChange={(e) => setSearch(e.target.value)}
              className="form__input wdith_3"
              minLength={2}
              debounceTimeout={800}
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
