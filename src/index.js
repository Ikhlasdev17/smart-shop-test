import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import rootReducer from './reducer/rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import 'flag-icons/css/flag-icons.css'

  console.error = () => {}
  console.debug = () => {}
  console.warn = () => {}
  console.log = () => {}




const store = configureStore({reducer: rootReducer, devTools: process.env.NODE_ENV !== 'production'})


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['uz', 'ru', 'qq'],
    detection: {
      order: [ 'cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie']
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false }
  });
 
ReactDOM.render(
    <Provider store={store}> 
        <App /> 
    </Provider>,
  document.getElementById('root')
)
