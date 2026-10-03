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
        const originalRequest = error.config;


        if (
            originalRequest.url.includes('/login') || 
            originalRequest.url.includes('/register')
            ) {
            return Promise.reject(error); // Direct original error (e.g., "Invalid credentials") pass karein
        }

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                const response = await refreshApi.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`,{},{withCredentials:true});
                const newAccessToken = response.data.accessToken;
                store.dispatch(setAccessToken(newAccessToken));
                store.dispatch(setUser(response.data.user));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }catch(refreshError){
                store.dispatch(clearAuth());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;