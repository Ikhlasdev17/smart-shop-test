import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Wrapper from './components/Layout/Layout';
import { Login } from './Pages/Login/Login'; 
import loadingLogo from '../src/assets/images/SmartShop2.png'
import axios from 'axios';
import { setToken, URL } from './assets/api/URL';
import { userLogout } from './redux/userSlice';

import {useSelector, useDispatch} from 'react-redux'

function App() { 


  const [loading, setLoading] = useState(true)
  const [setLogged, log] = useState(true)

  const dispatch = useDispatch()
  
  setTimeout(() => {
    setLoading(false)
  }, 1500) 

  if (loading) {

    fetch(`${URL}/api/currency` , setToken())
    .then(res => {
      if (res.status === 401) {
          dispatch(userLogout())
          setLogged(false)
      }
    })

    return <div className="overlay">
    <img src={loadingLogo} alt="" />
  </div>
  }
  
  return (
    <div className="App">
      
     <Router>
            <Routes>
                  <Route path="/*" element={<Wrapper />} />
                  <Route path="/login" element={<Login />} />
            </Routes>
    </Router>
    </div>
  )
}

export default App
