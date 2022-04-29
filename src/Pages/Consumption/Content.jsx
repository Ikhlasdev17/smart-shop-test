import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { setToken, URL } from '../../assets/api/URL';
import { fetchingConsumption, addConsumptions } from '../../redux/consumtionSlice';

import moment from 'moment';

import { useTranslation } from 'react-i18next';

const Content = ({ type, categories, setOpen }) => {

    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
       category_id: categories[0].id,
       whom: "",
       price: null,
       date: moment(Date.now()).format('YYYY-MM-DD'),
       description: "",
       type: type,
       payment_type: "card",
    })


    const {t} = useTranslation()

 


    const handleFinish = (e) => {
        dispatch(fetchingConsumption())
        axios.post(`${URL}/api/consumption`, formData, setToken())
        .then(res => {
            dispatch(addConsumptions({
                category_name: {
                    uz: categories.filter(item => item.id === formData.category_id)[0].name.uz
                },
                whom: formData.whom,
                price: formData.price,
                description: formData.description,
                date: formData.date
            }))

            setOpen(false)

            swal({
                title: t('muaffaqiyatli'),
                icon: 'success'
            })


            setFormData({
              category_id: categories[0].id,
              whom: "",
              price: null,
              date: moment(Date.now()).format('YYYY-MM-DD'),
              description: "",
              type: type,
              payment_type: "card",
           })
        })
        .catch(err => {
            swal({
                title: t('xatolik'),
                icon: 'error'
            })
        })
    }


  return (
    <Form layout={"vertical"} onFinish={handleFinish}> 
      <Form.Item label={t('kategoriya_tanlash')}>
        <Select className="form__input" value={formData.category_id} onChange={(e) =>  setFormData({...formData, category_id: e})} required>
            {categories?.map(item => (
            <Select.Option key={item.id} value={item.id}>{item.name.uz}</Select.Option>
            ))}
        </Select>
      </Form.Item>

      
      <Form.Item label={t('kimga')}>
        <Input value={formData.whom} placeholder={t('kimga')} className="form__input" onChange={(e) => setFormData({...formData, whom: e.target.value})} required/>
      </Form.Item>
      
      <Form.Item label={t('sum')}>
        <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} value={formData.price} placeholder={t('sum')} className="form__input" onChange={(e) => setFormData({...formData, price: e})} required/>
      </Form.Item>
      
      <Form.Item label={t('date')}>
        <DatePicker defaultValue={moment(formData.date, 'YYYY-MM-DD')} className="form__input"  onChange={(e, string) => {
          setFormData({...formData, date: string})
        }} required/>
      </Form.Item>

      <Form.Item label={t('tolov_turi')}>
        <Select  className="form__input" value={formData.payment_type} onChange={(e) =>  setFormData({...formData, payment_type: e})} required>
            <Select.Option value={"card"}>{t('cash')}</Select.Option>
            <Select.Option value="cash">{t('card')}</Select.Option>
             
        </Select>
      </Form.Item>
      
      <Form.Item label={t('description')}>
        <Input.TextArea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form__input" placeholder={t('description')} required></Input.TextArea>
      </Form.Item>


      <Button htmlType="submit" className="btn btn-primary" style={{width: '100%'}}>{t('save')}</Button>
      
    </Form>
  )
}

export default Content
