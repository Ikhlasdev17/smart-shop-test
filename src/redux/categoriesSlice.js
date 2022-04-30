import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    categoriesFetchingStatus: 'default'
}


const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        fetchingCategories: state => {
            state.categoriesFetchingStatus = 'loading'
            console.log(state.categories);
        },
        fetchedCategories: (state, action) => {
            state.categories = action.payload
            state.categoriesFetchingStatus = 'default'
        },
        fetchingErrorCategories: state => {
            state.categoriesFetchingStatus = 'error'
        },
        addNewCategory: (state, action) => {
            state.categories.unshift(action.payload)
            state.categoriesFetchingStatus = 'default'
        },
        updatingCategory: (state, action) => {
            const index = state.categories.findIndex(item => item.id === action.payload.id)
            state.categories[index] = action.payload
            console.log(action.payload);
            state.categoriesFetchingStatus = 'default'
        },
        deleteCategory: (state, action) => {
            state.categories.filter(item => item.id !== action.payload)
            state.categoriesFetchingStatus = 'default'
        }
    }
})



export const { fetchingCategories, fetchedCategories, fetchingErrorCategories, addNewCategory, updatingCategory, deleteCategory } = categoriesSlice.actions
const categoriesReducer = categoriesSlice.reducer

export default categoriesReducer