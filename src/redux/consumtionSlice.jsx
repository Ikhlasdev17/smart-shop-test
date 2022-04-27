import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    consumptions: [],
    consumptionsLoadingStatus: 'default'
}



const consumptionsSlice = createSlice({
    name: 'consumptions',
    initialState,
    reducers: {
        fetchingConsumption: (state) => {state.consumptionsLoadingStatus = 'loading'},
        fetchedConsumptions: (state, action) => {
            state.consumptions = action.payload,
            state.consumptionsLoadingStatus = 'default'
        },
        addConsumptions: (state, action) => {
            state.consumptions.push(action.payload);
            state.consumptionsLoadingStatus = 'default'
        }
    }
})


export const { fetchingConsumption, fetchedConsumptions, addConsumptions  } = consumptionsSlice.actions
const consumptionReducer = consumptionsSlice.reducer
export default consumptionReducer