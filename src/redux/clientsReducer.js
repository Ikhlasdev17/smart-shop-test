import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    clients: [],
    clientsFetchingStatus: 'default',
}



const clientSlice = createSlice({
    name: 'clients',
    initialState ,
    reducers: {
        fetchingClients: state => {
            state.clientsFetchingStatus = 'loading'
        },
        fetchedClients: (state, action) => {
            state.clients = action.payload
            state.clientsFetchingStatus = 'default'
        },
        clientsFetchingError: (state) => {
            state.clientsFetchingStatus = 'error'
        },
        addClient: (state, action) => {
            state.clients.unshift(action.payload)
            state.clientsFetchingStatus = 'default'
        }

    }
})


export const { fetchingClients, fetchedClients, clientsFetchingError, addClient } = clientSlice.actions;
const clientsReducer = clientSlice.reducer
export default clientsReducer