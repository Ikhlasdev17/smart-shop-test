import { Button, Form, Input, InputNumber, message } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { URL, setToken } from '../../assets/api/URL'
import { useTranslation } from 'react-i18next'
const Content = ({ currentValute, setOpen, setChanged, changed }) => {
    const [valute, setValute] = useState({
        currency_id: currentValute?.id,
        to_curreny_id: currentValute?.rate.length > 0 && currentValute?.rate[0].id,
        rate: currentValute?.rate.length > 0 && currentValute?.rate[0].rate   
    })
    const {t} = useTranslation()


    const handleSave = () => {
        axios.post(`${URL}/api/currency`, valute, setToken())
        .then(res => {
            setChanged(!changed)
            setOpen(false)
            message.success('Valyuta muaffaqiyatli ozgartirildi')
        })
    }

  return (
    <div>
        <Form layout={"vertical"}>
            <Form.Item label={t('kurs')} required>
                <InputNumber placeholder={t('kurs')} value={valute.rate} onChange={(e) => setValute({...valute, rate: e})} className="form__input" required />
            </Form.Item>
            <Button className="btn btn-primary" onClick={handleSave}>{t('save')}</Button>
        </Form>
    </div>
  )
}

export default Content
