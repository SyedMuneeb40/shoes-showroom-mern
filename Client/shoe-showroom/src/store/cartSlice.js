import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import reducer from "./authSlice";


const cartSlice = createSlice({
    name:"cart",
    initialState:
    {
        items: [],
        totalItems: 0,
        totalPrice: 0
    },
    reducers:
    {
        setCart: (state,action)=>{
            const items = action.payload.items || [];
            state.items = items;
            state.totalItems = items.reduce((total,item)=>{ return total + item.quantity},0);
            state.totalPrice = items.reduce((total,item)=>{ return total + (item.shoe.price * item.quantity)},0);
        },

        clearCart: (state)=>{
            state.items = [];
            state.totalItems = 0
            state.totalPrice = 0;
        }
    }
})

export const {setCart,clearCart} = cartSlice.actions;
export default cartSlice.reducer;