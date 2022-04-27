import React, { useState } from 'react'
import { Avatar, Button, Dropdown, Layout, Menu, Space } from 'antd';
import logo from '../../assets/images/SmartSHOP.svg'

import brandIcon from '../../assets/images/top-nav-brand-name-icon.svg'
import avatarLogo from '../../assets/images/avatar.jpg'

import { useDispatch } from 'react-redux'

import './TopNav.scss'
import { userLogout } from '../../redux/userSlice';
import i18next from 'i18next';
const { Header } = Layout;


const languages = [
  {lang: 'uz', icon: 'uz', label: "O'zbekcha"},
  {lang: 'ru', icon: 'ru', label: "Русский"},
  {lang: 'qq', icon: 'ga', label: "Qaraqalpaqsha"},
]



const brandMenu = (
  <Menu>
    <Menu.Item>
        Statistika
    </Menu.Item>
    <Menu.Item>
        Malumot
    </Menu.Item>
    <Menu.Item>
        Ko'rish
    </Menu.Item>
  </Menu>
);
 

const TopNav = ({ collapsed, setCollapsed, width, setLogged }) => {
  const dispatch = useDispatch()
  const [currentLang, setCurrentLang] = useState(document.cookie.split('i18next=')[1] || 'ru')
  const [currentLangLabel, setCurrentLabel] = useState(languages.filter(item => item.lang === currentLang)[0].label)

  const changeLang = (lang, label) => {
    i18next.changeLanguage(lang)
    setCurrentLang(lang)
    setCurrentLabel(label)
  }
  
  
  const languageMenu = (
    <Menu>
      {languages.map(item => (
        <Menu.Item key={item.lang} onClick={() => changeLang(item.lang, item.label)}>
            <button className="dropdown-btn" disabled={currentLang === item.lang}> 
            <span className={`fi fi-${item.icon} top-nav_icon`}></span> 
            {" "}
            {" "}
            {item.label}  
            </button>
        </Menu.Item>
      ))} 
    </Menu>
  );
  

  const profileMenu = (
    <Menu>
      <Menu.Item>
          Profil
      </Menu.Item>
      <Menu.Item>
          Sozlamalar
      </Menu.Item>
      <Menu.Item onClick={() => {
        localStorage.removeItem('token')
        setLogged('logout')
        }} >
          Chiqish
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="topnav">
      <div className="topnav__left">
      <div className="header__brand" style={width < 1200 ? {display: 'none'} : {}}>
        <img src={logo} alt="SmartShop" />
      </div>
      <Button onClick={setCollapsed}className="toggle__menu">
      <i className='bx bx-menu'></i></Button>
      </div>
      <div className="topnav__right-menu">
        <Dropdown overlay={brandMenu} placement="bottomLeft" className="dropdown">
          <span >
            <img src={brandIcon} alt="" />
            Brand Nomi
          </span>
        </Dropdown>
        <Dropdown overlay={languageMenu} placement="bottomLeft" className="dropdown">
            <span>
            <i className={`fi fi-${languages.filter(item => item.lang === currentLang)[0].icon} drop top-nav_icon`}></i>
            {" "}
            {currentLangLabel}
            </span>
        </Dropdown>
        <Dropdown overlay={profileMenu} placement="bottomLeft" >
          <Avatar width="40" src={avatarLogo} style={{cursor: 'pointer'}}/>
        </Dropdown>
      </div>
    </header>
  )
}

export default TopNav
