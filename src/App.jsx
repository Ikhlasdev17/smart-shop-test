
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wrapper from './components/Layout/Layout';
import { Login } from './Pages/Login/Login'; 
function App() { 
  
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
