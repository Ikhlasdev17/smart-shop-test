import { Button, Form, Input, InputNumber } from 'antd'
import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addNewCategory, fetchedCategories, fetchingCategories, updatingCategory } from '../../redux/categoriesSlice'
import { setToken, URL } from '../../assets/api/URL'
import { useTranslation } from 'react-i18next';

import swal from 'sweetalert'

const Content = ({ type, currentCategory, setOpen }) => {
    const dispatch = useDispatch()
    const { categories, categoriesFetchingStatus } = useSelector(state => state.categoriesReducer);

    const [category, setCategory] = useState({
        category_id: null,
        name: '',
        percents: {
            min_product: null,
            min: null,
            max: null,
            wholesale: null,
        }})

        const {t} = useTranslation()


    useEffect(() => {
        if(type === 'update'){
            setCategory({
            category_id: currentCategory?.id,
            name: currentCategory?.name,
            percents: {
                min_product: currentCategory?.min_product,
                min: currentCategory?.min_percent,
                max: currentCategory?.max_percent,
                wholesale: currentCategory?.whole_percent,
            }
        })
    }
}, [currentCategory])


console.info(currentCategory)

useEffect(() => {
        if (type === 'add') {
            setCategory({
                category_id: null,
                name: '',
                percents: {
                    min_product: 0,
                    min: null,
                    max: null,
                    wholesale: null,
                }})
        }
    },[type])


    

    const addCategory = async () => {
        if (category.name !== "" && category.percents.min !== null && category.percents.max !== null && category.percents.wholesale !== null) {
            dispatch(fetchingCategories())

            const res = await axios.post(`${URL}/api/category`, {
                name: category.name,
                percents: {
                    min_product: category.percents.min_product,
                    min: category.percents.min,
                    max: category.percents.max,
                    wholesale: category.percents.wholesale
                }
            }, setToken())

            if (res.status === 200) {
                dispatch(addNewCategory(res.data.payload))

                swal({
                    title: t('muaffaqiyatli'),
                    icon: 'success'
                })

                setCategory({
                    category_id: null,
                    name: '',
                    percents: {
                        min_product: 0,
                        min: null,
                        max: null,
                        wholesale: null,
                    }})
                setOpen(false)


            }
        } else {
            swal({
                title: t('malumotni_togri_kiriting'),
                icon: 'warning'
            })
        }


        console.info(category)

    }

    const updateCategory = async () => {
        if (category.category_id !== null && category.name !== "" && category.percents.min !== null && category.percents.max !== null && category.percents.wholesale !== null){
            const res = await axios.patch(`${URL}/api/category`, {
                category_id: category.category_id,
                name: category.name,
                min_product: category.percents.min_product,
                percents: {
                    min: category.percents.min,
                    max: category.percents.max,
                    wholesale: category.percents.wholesale
                }
            }, setToken())
        
        if(res.status === 200) {
            dispatch(fetchingCategories())
            dispatch(updatingCategory({
                id: category.category_id,
                max_percent: category.percents.max,
                min_percent: category.percents.min,
                name: category.name,
                min_product: category.percents.min_product,
                whole_percent: category.percents.wholesale
            }))

            setOpen(false)

            swal({
                title: t('muaffaqiyatli'),
                icon: 'success'
            })

            
        } else {
            swal({
                title: t('qayta_urinib_koring'),
                icon: 'error'
            })
        }
        } else {
            swal({
                title: t('malumotni_toliq_kiriting'),
                icon: 'warning'
            })
        }
    }


    const handleSubmit = () => {
        if (type === 'add') {
            addCategory();

            
        }

        if (type === 'update') {
            updateCategory();
        }
    }

  return (
    <Form layout='vertical' onFinish={handleSubmit}>
      <Form.Item label={t('kategoriya_nomi')}>
        <Input placeholder={t('kategoriya_nomi')} className="form__input" onChange={(e) => {setCategory({...category, name: e.target.value})}} value={category.name} />
      </Form.Item>

      <Form.Item label={t('ulgurji_foiz')}>
        <InputNumber prefix="%" className="form__input" placeholder={t('ulgurji_foiz')} onChange={(e) => {setCategory(prev => ({...category, percents: {...prev.percents, wholesale: e}}))}} value={category.percents.wholesale} />
      </Form.Item>

      <Form.Item label={t('minimum_foiz')}>
        <InputNumber prefix="%" className="form__input" placeholder={t('minimum_foiz')} onChange={(e) => {setCategory(prev => ({...category, percents: {...prev.percents, min: e}}))}}  value={category.percents.min} />
      </Form.Item>

      <Form.Item label={t('maksumum_foiz')} >
        <InputNumber prefix="%" className="form__input" placeholder={t('maksumum_foiz')} onChange={(e) => {setCategory(prev => ({...category, percents: {...prev.percents, max: e}}))}}  value={category.percents.max} />
      </Form.Item> 

      <Form.Item label={t('min_product')} >
        <InputNumber  className="form__input" placeholder={t('min_product')} onChange={(e) => {setCategory(prev => ({...category,  percents: {...prev.percents, min_product: e}}))}}  value={category.percents.min_product} />
      </Form.Item>


      <Form.Item>
          <Button htmlType='submit' className="btn btn-primary" style={{display: 'block'}}>
              {t('save')}
          </Button>
      </Form.Item>
    </Form>
  )
}

export default Content
