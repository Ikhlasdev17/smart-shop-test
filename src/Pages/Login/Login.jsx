import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, message } from 'antd';
import './Login.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userLogged } from '../../redux/userSlice';
import NumberFormat from 'react-number-format';

import { useTranslation } from 'react-i18next';


const URL = 'https://smart-shop.my-project.site'

export function Login() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation()
    const [user, setUser] = useState({
        phone: '',
        pincode: ''
    })
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/", { replace: true });
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.phone !== "" && user.password !== '' && user.pincode !== ''){
            axios.post(`${URL}/api/login`, user).then(res => {
                localStorage.setItem('token', res.data.payload.token)
                localStorage.setItem('role', res.data.payload.role)
                dispatch(userLogged(res.data.payload.token))
                navigate("/", { replace: true });
            })
            .catch(err => {
                message.error(t('parol_yoki_login_xato'))
            })
        }
    }

  return (
    <div className="container">
        <div className="login-content">
            <h1>{t('login')}</h1> 
            <p>{t('kirish')}</p>
        <Form className="login-form" onSubmit={handleSubmit} layout="vertical" > 

        <Form.Item  className="form-label" label={t('telefon_raqami')} name="mobile">
          <NumberFormat
            format="+998(##)###-##-##"
            mask={"_"}
            onValueChange={e => {
              setUser({...user, phone: `+998${e.floatValue}`})
            }}
            className="input__input"
            placeholder={t('telefon_raqami')} 
            required
            value={user.phone.slice(3, user.phone.length)}
            
          />
        </Form.Item>

        <Form.Item className="form-label" label={t('parol')}  >
            <Input.Password htmlType="password" className="input__input" onChange={(e) => setUser({...user, pincode: e.target.value})}  placeholder="Password" required/>
        </Form.Item>
        <br />
        <Button htmlType="submit" className="btn btn-primary" style={{width: '100%',}} onClick={handleSubmit}>
            {t('login')}
        </Button>
        </Form>
        </div>
    </div>
  )
} 
