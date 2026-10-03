import axios from 'axios';
import store from '../store/store';
import { clearAuth, setAccessToken, setUser } from '../store/authSlice';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});


api.interceptors.request.use(
    (config)=>{
        const accessToken = store.getState().auth.accessToken;
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response)=>{
        return response;
    },
    async (error)=>{
        const orignalRequest = error.config;

        if(error.response?.status === 401 && !orignalRequest._retry){
            orignalRequest._retry = true;
            try{
                const response = await refreshApi.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`,{},{withCredentials:true});
                const newAccessToken = response.data.accessToken;
                store.dispatch(setAccessToken(newAccessToken));
                store.dispatch(setUser(response.data.user));
                orignalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(orignalRequest);
            }catch(refreshError){
                store.dispatch(clearAuth());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;