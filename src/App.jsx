import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wrapper from './components/Layout/Layout';
import { Login } from './Pages/Login/Login'; 
import loadingLogo from '../src/assets/images/LOGOTEXNOPOS.png'

function App() { 


  const [loading, setLoading] = useState(true)
  
  setTimeout(() => {
    setLoading(false)
  }, 1500)

  if (loading) {
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
