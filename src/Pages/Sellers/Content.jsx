
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


const { Option } = Select;
 

const   Content = ({ setRefresh, setOpen, modalType = 'add', currentSallary, refresh}) => {
  const dispatch = useDispatch()

  const [user, setUser] = useState(modalType === 'add' ? {
    name: "",
    phone: "",
    password: "", 
    salary: "",
    flex: "",
    role: "saller",
    pincode: null
  } : { 
    salary: currentSallary?.salary,
    flex: currentSallary?.flex,   
    employee_id: currentSallary?.id,
    is_everyone: modalType === 'update' ? false : modalType === 'change_all_salary' && true
  })
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const roles = [
    {value: 'saller', label: t('seller')},
    {value: 'admin', label: t('admin')},
  ]



  useEffect(() => {
    if (modalType === 'add'){
      setUser({
        name: "",
        phone: "",
        password: "", 
        salary: "",
        flex: "",
        role: "saller",
        pincode: null
      })
    }


    if (modalType === 'update'){
      setUser({
        salary: currentSallary?.salary,
        flex: currentSallary?.flex,   
        employee_id: currentSallary?.id,
        is_everyone: false
      })
    }
  },[modalType, currentSallary])

  const generatePincode = () => {
    axios.get(`${URL}/api/pincode/generate`, setToken())
    .then(res => setUser({...user, pincode: res.data.payload.pincode}))
  }

  useEffect(() => {
    generatePincode()
  }, []) 

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
              role: "saller"
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



  const handleSubmit = async (e) => {
    if (modalType === 'add') {
        addSallary()
    }

    if (modalType === 'update') {
        updateSallary()
    }
  }




  useEffect(() => {
    if (copied){
      setTimeout(() =>{
        setCopied(false)
      }, 2000)
    } 
  },[copied])
 
  return (
    <>
      
      
      {modalType === 'update' || modalType === 'change_all_salary' ? (
        <>
        <div className="form__label">
          <span>{t('ish_haqi')}</span>
          <InputNumber value={user.salary} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form__input" required placeholder={t('ish_haqi')} onChange={e => {
            setUser({...user, salary: e})}} />
        </div>
        <div className="form__label">
          <span>FLEX</span>
            <InputNumber 
              className="form__input"
              required
              placeholder="FLEX" 
              onChange={e => {setUser({...user, flex: e})}} 
              value={user.flex}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')} />
          </div>
          <Button onClick={updateSallary} className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '2px'}} htmlType="submit" >{t('save')}</Button>
            </>
      ) : (
        <>
        <Form layout="vertical" onFinish={(e) => handleSubmit(e)}>
        <Form.Item label={t('fio')} name="fish" required>
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

        {modalType === 'add' && <Form.Item label={t('lavozim_tanlash')} required>
            <Select className="form__input" value={user.role} onChange={e => setUser({...user, role: e})}required>
              {roles.map(item => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
        </Form.Item> }

        <Form.Item label={t('parol')} name="parol" required>
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
         
         
         <Form.Item label={t('telefon_raqami')} name="mobile" required>
          <NumberFormat
            className="form__input"
            format="+998(##)###-##-##"
            mask={"_"}
            onValueChange={e => {
              setUser({...user, phone: `+998${e.floatValue}`})
            }}

            placeholder={t('telefon_raqami')}
            required
            value={user.phone?.slice(3, user.phone.length)}
            
          />
        </Form.Item>

        <Form.Item label={t('ish_haqi')} name="salary" required>
          <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} className="form__input" required placeholder={t('ish_haqi')} onChange={e => {
            setUser({...user, salary: e})}} value={user.salary} />
          </Form.Item>
        <Form.Item label="FLEX" name="flex" required>
          <InputNumber 
            className="form__input"
            required
            placeholder="FLEX" 
            onChange={e => {setUser({...user, flex: e})}} 
            value={user.flex}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')} />
          </Form.Item>

          <Form.Item label={t('pinkod')} name="pincode" required className="form-group">
          <Input.Group compact required className='form-group'>
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
            </Input.Group>
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