
import React, { useEffect, useState } from 'react'
import { Form, Select, Input, Button, InputNumber, message } from 'antd';
import NumberFormat from "react-number-format";
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL';
import { useDispatch, useSelector } from 'react-redux'
import { addSeller, fetchingSellers } from '../../redux/sellersSlice';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import swal from  'sweetalert'
import Dragger from 'antd/lib/upload/Dragger';
 



const   Content = ({ open, setRefresh, setOpen, modalType = 'add', currentSallary, refresh}) => {
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    name: "",
    phone: "",
    password: "", 
    salary: "",
    flex: "",
    role: "saller",
    pincode: null,
    avatar: null
  })
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const roles = [
    {value: 'saller', label: t('seller')},
    {value: 'admin', label: t('admin')},
  ]

  const [pinCode, setPinCode] = useState(null)
  const [savePinCode, setSavePinCode] = useState(0)
  const [photoUploaded, setPhotoUploaded] = useState("default") 

  const [generating, setGenerating] = useState(false)


  useEffect(() => { 

    switch (modalType) {
      case 'add':
        setUser({
          name: "",
          phone: "",
          password: "", 
          salary: "",
          flex: "",
          role: "saller",
          pincode: null,
          avatar: null
        })
        break;
      case 'update':
        setUser({
          salary: currentSallary.salary,
          flex: currentSallary.flex,   
          employee_id: currentSallary.id,
          is_everyone: false
        })
        break;
      case 'update_user_data':
        setUser({
          employee_id: currentSallary.id,
          name: currentSallary.name,
          phone: currentSallary.phone,
          password: "1111",
          role: currentSallary.role,
          pincode: pinCode,
          avatar: currentSallary.avatar
        })
        break;
      case 'change_all_salary':
        setUser({
          salary: 0,
          flex: 0,
          is_everyone: true
        }) 
        break;
    }


    setPhotoUploaded("default")

    
  },[modalType, currentSallary, open])


 

  const generatePincode = () => {
    setPinCode("XXXXX")
    setGenerating(true)
    axios.get(`${URL}/api/pincode/generate`, setToken())
    .then(res => { 
        // setUser({ ...user, pincode: res.data.payload.pincode })
        setPinCode(res.data.payload.pincode)
        setSavePinCode(res.data.payload.pincode)
        setGenerating(false)
    })
  }

  const addSallary = async () => {
    if (user.name !== "" && user.phone !== "" && user.password !== "" && user.flex !== "" && user.salary !== "" && user.role !== ""){
        const res = await axios.post(`${URL}/api/register/admin`, {
          ...user,
          pincode: pinCode
        },  setToken())
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
            title: `${t('sotuvchiga_pinkod')}! ${savePinCode}`,
            icon: 'success'
          })

          setUser({
              name: "",
              phone: "",
              password: "",
              salary: "",
              flex: "",
              role: "saller",
              pincode: null,
              avatar: null
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

  const photoUploader = (e) => {
    setPhotoUploaded('loading')
    
    const formData = new FormData()
    formData.append('file', e.file.originFileObj)
    formData.append('upload_preset', "smart-shop")


    axios.post("https://api.cloudinary.com/v1_1/http-electro-life-texnopos-site/image/upload", formData).then(res => {
      setUser(prev => ({...user, avatar: res.data.secure_url}))
      setPhotoUploaded('ok')
    })
  } 



  useEffect(() => {
    if (modalType === 'add') {
      generatePincode()
    } 
  }, [modalType])



  const updateSallary = async () => {
    const res = await axios.post(`${URL}/api/salary`, {
      ...user
    }, setToken())
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
    const res = await axios.patch(`${URL}/api/employee/update`, {
      ...user,
      pincode: pinCode
    }, setToken())
    
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

  useEffect(() => {
    setPinCode(null)
  },[open])




 
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
                prefix="%"
                />
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

        {modalType === 'add' && <Form.Item label={t('lavozim_tanlash')} required>
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
                <CopyToClipboard text={pinCode !== null ? pinCode : "XXXXX"} onCopy={() => setCopied(true)}>
                  <div className={copied ? 'pincode__field copied' : 'pincode__field'}>
                    {pinCode !== null ? (!copied ? pinCode : t('copied')) : "XXXXX"} 
                  </div>
                </CopyToClipboard>
                </div>
                <div className="form-group__min-item">
                <Button loading={generating} className='btn btn-primary' onClick={e => generatePincode()}>
                  {t('yangilash')}
                </Button>
                </div>
                </div>
              </Form.Item>

              <Dragger className="photo__uploader" onChange={photoUploader} showUploadList={false}>
                  {photoUploaded === 'default' ? (
                    <>
                      <i className='bx bx-cloud-upload ant-upload-drag-icon'></i>
                  <h4>{t('rasm_yuklang')}</h4>
                  <p>{t('rasimni_tanlash_text')}</p>
                    </>
                  ) : photoUploaded === 'ok' ? (
                    <>
                      <i className='bx bx-check-circle success-icon'></i>
                      <h4>{t('muaffaqiyatli')}</h4>
                    </>
                  ) : photoUploaded === 'loading' && (
                    <>
                      <i className='bx bx-time-five ant-upload-drag-icon'></i>
                      <h4>{t('kuting')}</h4>
                    </>
                  )}
            </Dragger> 
          <br />
          <Button className="btn btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '2px'}} htmlType="submit" >{t('save')}</Button>
          </Form> 
          </>
      )}  
    </>
  )
}

export default Content