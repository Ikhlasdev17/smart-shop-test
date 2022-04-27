import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sellers: [],
    sellersFetchingStatus: 'default'
}



const sellersSlice = createSlice({
    name: 'sellers',
    initialState,
    reducers: {
        fetchingSellers: state => {
            state.sellersFetchingStatus = 'loading'
        },
        fetchedSellers: (state, action) => {
            state.sellers = action.payload
            state.sellersFetchingStatus = 'default'
        },
        fetchingErrorSellers: state =>{
            state.sellersFetchingStatus = 'error'
        },
        addSeller: (state, action) => {
            state.sellers.push(action.payload)
            state.sellersFetchingStatus = 'default'
        }
    }
})


export const { fetchingSellers, fetchingErrorSellers, fetchedSellers, addSeller } = sellersSlice.actions
const sellersReducer = sellersSlice.reducer
export default sellersReducer