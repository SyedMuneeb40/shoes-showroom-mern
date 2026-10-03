import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials : (state,action)=>{
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.error=null,
            state.initialized=true
        },

        setUser: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        setAccessToken: (state,action)=>{
            state.accessToken = action.payload;
            state.isAuthenticated=true
        },

        clearAuth: (state)=>{
            state.user=null,
            state.accessToken=null,
            state.isAuthenticated=false,
            state.error=null,
            state.loading=false
        },

        setLoading: (state,action)=>{
            state.loading = action.payload
        },

        setError: (state,action)=>{
            state.error = action.payload;
        },

        setInitialized: (state , action)=>{
            state.initialized = action.payload;
        }
    }
});


export const {setCredentials,setUser,setAccessToken,setLoading,setError,clearAuth,setInitialized} = authSlice.actions;
export default authSlice.reducer;