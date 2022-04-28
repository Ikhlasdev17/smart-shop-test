import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import rootReducer from './reducer/rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from './Pages/Login/Login';
import Wrapper from './components/Layout/Layout';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import 'flag-icons/css/flag-icons.css'

if (process.env.NODE_ENV === 'production') {
  console.error = () => {}
  console.debug = () => {}
  console.warn = () => {}
}



const store = configureStore({reducer: rootReducer, devTools: process.env.NODE_ENV !== 'production'})


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    lng: 'uz',
    supportedLngs: ['uz', 'ru', 'qq'],
    detection: {
      order: [ 'localStorage', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false }
  });


  

 


ReactDOM.render(
    <Provider store={store}>
    <Router>
            <Routes>
                  <Route path="/*" element={<Wrapper />} />
                  <Route path="/login" element={<Login />} />
            </Routes>
    </Router>
    </Provider>,
  document.getElementById('root')
)
