import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import cartSlice from './cartSlice.js'
const store = configureStore(
    {
        reducer: 
        {
            auth: authSlice,
            cart: cartSlice
        }
    }
);

export default store;