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
import InputMask from 'react-input-mask';

import photo from '../../assets/images/LOGOTEXNOPOS.png'



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

        
    }, [])

    const name = useRef(null);
    const password = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const spl = (user.phone.split(')').join(''))
        const spl2 = (spl.split('(').join(''))
        const spl3 = (spl2.split('-').join(''))
            axios.post(`${URL}/api/login`, {
                phone: spl3,
                password: user.password
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
    <div className='flex w-full h-screen'>
        {/* FLEX COLUMNS FOR LOGIN SECTION AND IMAGE SECTION */}
        <div className='flex flex-col items-center justify-start h-screen w-50% sm:w-full sm:justify-center'>
            {/*  LOGIN SECTION  */}
            <div className='flex w-2/3 h-screen items-center justify-center sm:w-full sm:px-4'>
                <div>
                  {/* LOGO */}
                {/* <img style={{marginLeft: '-38px'}}  src={logo} alt="VIVIAN" /> */}
                <h1 style={{fontSize: '48px'}} className="font-medium text-md">Login</h1>
                <p className='text-gray-txt-color mb-8 -mt-6'>С возвращением! Пожалуйста, введите свои данные.</p>
                
                {/* FORM */}
                <form 
                  className='flex flex-col w-full justify-start'
                  onSubmit={handleSubmit}
                >
                    <label >
                      <span className='block mb-2'>
                        Телефон номер
                      </span>
                      <InputMask 
                        mask="+\9\9\8(99)999-99-99" 
                        value={user.phone} 
                        onChange={e => {
                          setUser({...user, phone: e.target.value})
                        }}
                        required
                        className='p-3 w-80 bg-white border border-input-border rounded sm:w-full'
                        
                        >
                        {(inputProps) => <input 
                          placeholder='Телефон номер' 
                          type="tel"
                          {...inputProps}
                      />}
                      </InputMask>
                    </label>

                    <label className='mt-4'>
                      <span className='block mb-2'>
                        Пароль
                      </span>
                      <input 
                        placeholder='Пароль' 
                        type="password"   
                        className='p-3 w-80 bg-white border border-input-border rounded sm:w-full'
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                      />
                    </label>

                    <button type='submit' className='mt-12 p-3 w-80 sm:w-full bg-blue-500 bg-blue text-white font-bold py-2 px-4 rounded'>
                        Войти
                    </button>
                </form>
                </div>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center h-screen w-50% bg-blue px-2 sm:hidden'>
            {/*  IMAGE SECRION  */}
            <img src={photo} alt="" />
        </div>
    </div>
  )
} 
