import { createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert";

const initialState = {
    data: {},
    logged: false
}


const userSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        userLogged: (state, action) => {
            state.logged = true
            localStorage.setItem('token', action.payload)
            
        },
        userLogout: (state) => {
            localStorage.removeItem('token')
            state.logged = false
        }
    }
})

export const { userLogged, userLogout } = userSlice.actions
const userReducer = userSlice.reducer

export default userReducer