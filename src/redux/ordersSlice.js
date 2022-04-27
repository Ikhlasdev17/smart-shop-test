import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orders: [],
    ordersFetchingStatus: 'default'
}



const ordersSlice = createSlice({
    name: 'Orders',
    initialState,
    reducers: {
        fetchingOrders: (state) => {state.ordersFetchingStatus = 'loading'},
        fetchedOrders: (state, action) => {
            state.orders = action.payload
            state.ordersFetchingStatus = 'default'
        },
        fetchingError: (state, action) => {
            state.ordersFetchingStatus = 'error'
        }
    }
})



export const { fetchingOrders, fetchingError, fetchedOrders } = ordersSlice.actions
const ordersReducer = ordersSlice.reducer
export default ordersReducer
