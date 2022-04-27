import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Defect from '../Defect/Defect'
import LowProducts from '../LowProducts/LowProducts'
import Products from './Products/Products'

const Warehouse = () => {
  return (
    <>
        <Outlet />
        <Routes>
            <Route path="products" element={<Products />} /> 
            <Route path="defect" element={<Defect />} />
            <Route path="lowProducts" element={<LowProducts />} /> 
        </Routes>
    </>
  )
}

export default Warehouse
