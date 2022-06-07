import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, message } from 'antd';
import './Login.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userLogged } from '../../redux/userSlice';
import NumberFormat from 'react-number-format';

import { useTranslation } from 'react-i18next';

import { URL } from '../../assets/api/URL';


export function Login() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation()
    const [user, setUser] = useState({
        password: '',
        phone: ""
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
                localStorage.setItem('user', JSON.stringify(res.data.payload))
                localStorage.setItem('password', user.password)
                localStorage.setItem('pincode', user.pincode)
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
            style={{padding: '5px'}}
            mask={"_"}
            onValueChange={e => {
              setUser({...user, phone: `+998${e.floatValue}`})
            }}
            className="input__input"
            placeholder={t('telefon_raqami')}
            value={user.phone} 
            required
          />

        </Form.Item>

        <Form.Item className="form-label" label={t('parol')}>
            <Input.Password htmlType="password" className="input__input" onChange={(e) => setUser({...user, password: e.target.value})}  placeholder="Password" required/>
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
