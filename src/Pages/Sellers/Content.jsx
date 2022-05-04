
import React, { useEffect, useState } from 'react'
import { Form, Select, Input, Button, InputNumber, message } from 'antd';
import NumberFormat from "react-number-format";
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL';
import { useDispatch, useSelector } from 'react-redux'
import { addClient, fetchingClients } from '../../redux/clientsReducer';
import { addSeller, fetchingSellers } from '../../redux/sellersSlice';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import swal from  'sweetalert'

const { Option } = Select;



const   Content = ({ open, setRefresh, setOpen, modalType = 'add', currentSallary, refresh}) => {
  const dispatch = useDispatch()
  
  const [time, setTime] = useState(true)
  const [user, setUser] = useState({
    name: "",
    phone: "",
    password: "", 
    salary: "",
    flex: "",
    role: "saller",
    pincode: null
  })
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const roles = [
    {value: 'saller', label: t('seller')},
    {value: 'admin', label: t('admin')},
  ]

  const [pinCode, setPinCode] = useState("")


  useEffect(() => {
    if (modalType === 'add'){
      setUser({
        name: "",
        phone: "",
        password: "", 
        salary: "",
        flex: "",
        role: "saller",
        pincode: ""
      })
    }


    if (modalType === 'update'){
      setUser({
        salary: currentSallary.salary,
        flex: currentSallary.flex,   
        employee_id: currentSallary.id,
        is_everyone: false
      })
    }

    if (modalType === 'change_all_salary'){
      setUser({
        salary: 0,
        flex: 0,   
        is_everyone: true
      })
    }

    
  },[modalType, currentSallary])


  useEffect(() => {
    if (modalType === "update_user_data") {
      setUser({
        employee_id: currentSallary.id,
        name: currentSallary.name,
        phone: currentSallary?.phone,
        salary: currentSallary.salary,
        flex: currentSallary.flex,
        role: currentSallary.role,
        pincode: pinCode
      })
    }

    
  }, [modalType, currentSallary.name, pinCode])

  console.info(currentSallary)

  const generatePincode = () => {
    axios.get(`${URL}/api/pincode/generate`, setToken())
    .then(res => {
      if (modalType === "update_user_data"){
        setPinCode(res.data.payload.pincode)
      } else {
        setUser({...user, pincode: res.data.payload.pincode})
      }
    })
  }

  useEffect(() => {
    if (modalType === 'add' | modalType === "update_user_data") {
      generatePincode()
    }
  }, [open, modalType, currentSallary]) 

  const addSallary = async () => {
    if (user.name !== "" && user.phone !== "" && user.password !== "" && user.flex !== "" && user.salary !== "" && user.role !== ""){
        const res = await axios.post(`${URL}/api/register/admin`, user,  setToken())
        .catch(res => {
          swal({
            title: t('xatolik'),
            icon: 'error'
          })
        })
        
        if (res.status === 200) {
          dispatch(fetchingSellers())
          dispatch(addSeller(user));
          setOpen(false)
          swal({
            title: `${t('sotuvchiga_pinkod')}! ${user.pincode}`,
            icon: 'success'
          })

          setUser({
              name: "",
              phone: "",
              password: "",
              salary: "",
              flex: "",
              role: "saller",
              pincode: ""
          })

          generatePincode()
        } else {
          swal({
            title: t('xatolik'),
            icon: 'error'
          })

          generatePincode()
        }
      } else {
        swal({
          title: t('malumotni_toliq_kiriting'),
          icon: 'warning'
        })

        generatePincode()
      }
  }


  const updateSallary = async () => {
    const res = await axios.post(`${URL}/api/salary`, user, setToken())
    if (res.status === 200) {
      message.success(t('muaffaqiyatli'))
      setRefresh(Math.random() * 10)
      setOpen(false)
    }
  }

  const changeAllSalary = async () => {
    const res = await axios.post(`${URL}/api/salary`, user, setToken())
    if (res.status === 200) {
      message.success(t('muaffaqiyatli'))
      setRefresh(Math.random() * 10)
      setOpen(false)
    }
  }

  const updateUserData = async () => {
    console.info(user)
    const res = await axios.patch(`${URL}/api/employee/update`, user, setToken())

    if (res.status === 200) {
      swal({
        title: t('muaffaqiyatli'),
        icon: 'success'
      })

      setRefresh(!refresh)

      setOpen(false)
    }

  }



  const handleSubmit = async (e) => {
    if (modalType === 'add') {
        addSallary()
    }

    if (modalType === 'update') {
        updateSallary()
    }

    if (modalType === "change_all_salary") {
      changeAllSalary()
    }

    if (modalType === "update_user_data") {
      updateUserData()
    }
  }




  useEffect(() => {
    if (copied){
      setTimeout(() =>{
        setCopied(false)
      }, 2000)
    } 
  },[copied])


  console.info(user.phone?.slice(4, user.phone.length))


 
  return (
    <>
      
      
      {modalType === 'update' || modalType === 'change_all_salary' ? (
        <>
        <div className="form__label">
          <span>{t('ish_haqi')}</span>
          <InputNumber value={user?.salary} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form__input" required placeholder={t('ish_haqi')} onChange={e => {
            setUser({...user, salary: e})}} />
          </div>
          <div className="form__label">
            <span>FLEX</span>
              <InputNumber 
                className="form__input"
                required
                placeholder="FLEX" 
                onChange={e => {setUser({...user, flex: e})}} 
                value={user?.flex}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} />
            </div>
            <Button onClick={updateSallary} className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '2px'}} htmlType="submit" >{t('save')}</Button>
              </>
      ) : (
        <>
        <Form layout="vertical" onFinish={(e) => handleSubmit(e)}>
        <Form.Item label={t('fio')} required>
          <Input 
            placeholder={t('fio')}
            onChange={e => {
              setUser({...user, name: e.target.value})
            }}
            value={user.name}
            className="form__input"
            required
          />
        </Form.Item>

        {modalType === 'add' || modalType === "update_user_data" && <Form.Item label={t('lavozim_tanlash')} required>
            <Select className="form__input" value={user.role} onChange={e => setUser({...user, role: e})}required>
              {roles.map(item => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
        </Form.Item> }
            {modalType !== "update_user_data" && (
        <Form.Item label={t('parol')} required>
          <Input 
            placeholder={t('parol')}
            onChange={e => {
              setUser({...user, password: e.target.value})
            }}
            value={user.password}
            required
            className="form__input"
          />
        </Form.Item>
            )}
         
         <Form.Item label={t('telefon_raqami')} required>
          <NumberFormat
            className="form__input"
            format="+998(##)###-##-##"
            style={{padding: '5px'}}
            mask={"_"}
            onValueChange={e => {
              setUser({...user, phone: `+998${e.floatValue}`})
              console.info(`+998${e.floatValue}`)
            }}

            placeholder={t('telefon_raqami')}
            required
            value={user.phone?.slice(4, user.phone.length)}
            
          />
        </Form.Item>

          {modalType !== "update_user_data" && (<>
        <Form.Item label={t('ish_haqi')}  required>
          <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form__input" required placeholder={t('ish_haqi')} onChange={e => {
            setUser({...user, salary: e})}} value={user.salary} />
          </Form.Item>
        <Form.Item label="FLEX" required>
          <InputNumber 
            className="form__input"
            required
            placeholder="FLEX" 
            onChange={e => {setUser({...user, flex: e})}} 
            value={user.flex}
            prefix="%"
            />
          </Form.Item>
            
            </>
            )}
              <Form.Item label={t('pinkod')} required>
              <div className='form-group'>
                <div className="form-group__item">
                <CopyToClipboard text={user.pincode} onCopy={() => setCopied(true)}>
                  <div className={copied ? 'pincode__field copied' : 'pincode__field'}>
                    {!copied ? user.pincode : t('copied')} 
                  </div>
                </CopyToClipboard>
                </div>
                <div className="form-group__min-item">
                <Button className='btn btn-primary' onClick={e => generatePincode()}>
                  {t('yangilash')}
                </Button>
                </div>
                </div>
              </Form.Item>
          <br />
          <Button className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '2px'}} htmlType="submit" >{t('save')}</Button>
          </Form> 
          </>
      )}  
    </>
  )
}

export default Content