import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  address: "",
  phone: "",
  image: ""
}

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    changeData: (state, action) => {
      state.name = action.payload.name
      state.address = action.payload.address
      state.phone = action.payload.phone
      state.image = action.payload.image
    }
  }
})

export const { changeData } = companySlice.actions
const companyReducer = companySlice.reducer
export default companyReducer