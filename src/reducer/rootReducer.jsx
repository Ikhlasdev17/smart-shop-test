import { combineReducers } from "redux";

import productsReducer from '../redux/productsSlice'
import clientsReducer from './../redux/clientsReducer';
import sellersReducer from './../redux/sellersSlice'
import categoriesReducer from './../redux/categoriesSlice'
import ordersReducer from './../redux/ordersSlice'
import consumptionReducer from '../redux/consumtionSlice'
import userReducer from '../redux/userSlice'
import companyReducer from "../redux/companySlice";

const rootReducer = combineReducers({
    userReducer,
    productsReducer,
    clientsReducer,
    sellersReducer,
    categoriesReducer,
    ordersReducer,
    consumptionReducer,
    company: companyReducer
})

export default rootReducer