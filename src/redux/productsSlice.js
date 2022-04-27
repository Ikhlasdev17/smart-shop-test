import  { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    productsFetchingStatus: 'default'
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchingProducts: state =>{ state.productsFetchingStatus = 'loading'},
        fetchedProducts: (state, action) => {
            state.productsFetchingStatus = 'default'
            state.products = action.payload 
        },
        fetchingError: (state) => {
            state.productsFetchingStatus = 'error'
        },
        addProduct: (state, action) => {
            state.products.push(action.payload)
            state.productsFetchingStatus = 'default'
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p.name === action.payload.product_id)
            state.products[index] = action.payload
            state.productsFetchingStatus = 'default'
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(item => item.id !== action.payload)
            state.productsFetchingStatus = 'default'
        }
    }
})


const productsReducer = productsSlice.reducer
export const { fetchingProducts, fetchingError, fetchedProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsReducer;
