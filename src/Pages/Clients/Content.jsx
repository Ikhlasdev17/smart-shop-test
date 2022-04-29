import React, { useEffect, useState } from 'react'
import { Form, Select, Input, Button, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import NumberFormat from "react-number-format";
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL';
import { useDispatch, useSelector } from 'react-redux'
import { addClient, fetchingClients } from '../../redux/clientsReducer';
import { t } from 'i18next';
import swal from 'sweetalert'

const { Option } = Select;
 

const   Content = ({ setOpen, currentClient, modalType }) => {
  const [shaxsTuri, setShaxsTuri] = useState('')
  const dispatch = useDispatch()

  const [user, setUser] = useState({
    full_name: "",
    phone: "",
    type: "J",
    about: ""
  })


  useEffect(() => {
    if (modalType === "update") {
      setUser({ 
        client_id: currentClient.id,
        full_name: currentClient.full_name,
        phone: currentClient.phone,
        type: currentClient.type,
        about: currentClient.about,
      })

      if (currentClient.type === 'Y') {
        setUser({ 
          client_id: currentClient.id,
          full_name: currentClient.full_name,
          phone: currentClient.phone,
          type: currentClient.type,
          about: currentClient.about,
          tin: currentClient.tin,
        })
      }

    } else if (modalType === 'add') {
      setUser({ 
        full_name: "",
        phone: "",
        type: "J",
        about: "",
      })
    }
  } ,[modalType, currentClient])


  const handleSubmit = async (e) => {

    if (user.full_name !== "" && user.phone !== "" && user.type !== "" && user.about !== ""){
      if (modalType === "add") {
        dispatch(fetchingClients())
        const res = await axios.post(`${URL}/api/register/client`, user,  setToken())

        if (res.status === 201) {
          dispatch(addClient({...res.data.payload, ...user, balance: 0}));
          setOpen(false)
          swal({
            title: t('muaffaqiyatli'),
            icon: 'success'
          })
          setUser({ 
            full_name: "",
            phone: "",
            type: "J",
            about: "",
          })
        } else {
          swal({
            title: t('malumotni_togri_kiriting'),
            icon: 'error'
          })
        }
      }


      if (modalType === 'update') {
        dispatch(fetchingClients())
        const res = await axios.patch(`${URL}/api/update/client`, user,  setToken())

        if (res.status === 200) {
          setOpen(false)
          swal({
            title: t('muaffaqiyatli'),
            icon: 'success'
          })
        } else {
          swal({
            title: t('malumotni_togri_kiriting'),
            icon: 'error'
          })
        }
      }
    } else {
      swal({
        title: t('malumotni_toliq_kiriting'),
        icon: 'warning'
      })
    }


    
    
  }
 
  return (
    <>
      <Form layout="vertical" onFinish={(e) => handleSubmit(e)}>
        <div className="form__label">
          <span>{t('shaxs_turi')}</span>
        <Select
            style={{width: '100%'}}
            onChange={(e) => {
              setShaxsTuri(e)
              setUser({...user, type: e})
            }}
            placeholder={t('shaxs_turi')}
            value={user.type}
            required
            className="form__input"
          >
            <Option value='Y'>{t('yuridik')}</Option>  
            <Option value='J'>{t('jismoniy')}</Option>  
          </Select>
        </div>

        <div className="form__label">
          <span>FIO</span>
          <Input 
            placeholder={t('ism_familiya')}
            onChange={e => {
              setUser({...user, full_name: e.target.value})
            }}
            value={user.full_name}
            required
            className="form__input"
          />
        </div>

        {user.type === 'Y' ? <div className="form__label">
          <span>STIR</span>
          <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} className="form__input" placeholder="123 456 789" onChange={e => {
            setUser({...user, tin: e})
          }} value={user.tin} required maxLength={11}/>
        </div> : ''}

        <div className="form__label">
          <span>{t('telefon_raqami')}</span>
          <NumberFormat
            className="form__input"
            format="+998(##)###-##-##"
            mask={"_"}
            style={{padding: '5px'}}
            onValueChange={e => {
              setUser({...user, phone: `+998${e.floatValue}`})
            }}
            required
            value={user.phone.slice(4, user.phone.length)}
            placeholder={t('telefon_raqami')}
            
          />
        </div>

        <div className="form__label">
          <span>{t('mijoz_haqida')}</span>
          <TextArea className="form__input" required placeholder={t('mijoz_haqida')} onChange={e => {setUser({...user, about: e.target.value})}} value={user.about} /></div>
        <Button className="btn btn-primary"  style={{width: '100%'}} htmlType="submit">{t('saqlash')}</Button>
      </Form> 
    </>
  )
}

export default Content