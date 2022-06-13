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
import { useRef } from 'react';


export function Login() {
    const [user, setUser] = useState({
        password: '',
        phone: ""
    })
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {t} = useTranslation()
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/", { replace: true });
        }

        name.current.focus();
        
    }, [])

    const name = useRef(null);
    const password = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
            axios.post(`${URL}/api/login`, {
                phone: name.current.value,
                password: password.current.value
            }).then(res => {
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



        console.info(name.current.value);
        console.info(password.current.value);
    }

  return (
    <div className="container">
        <div className="login-content">
            <h1>{t('login')}</h1> 
            <p>{t('kirish')}</p>
        <form className="login-form" onSubmit={handleSubmit} layout="vertical" > 

        <div  className="form-label" label={t('telefon_raqami')} name="mobile">
        <input
            style={{padding: '5px'}}
            className="input__input"
            placeholder={'Telefon raqami'}
            ref={name}
            required
          />

        </div>

        <div className="form-label" label={t('parol')}>
            <input className="input__input"  placeholder="Password" ref={password} required/>
        </div>
        <br />
        <button type='submit' className="btn btn-primary" style={{width: '100%',}} onClick={handleSubmit}>
            {t('login')}
        </button>
        </form>
        </div>
    </div>
  )
} 
