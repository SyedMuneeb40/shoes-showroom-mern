import api from '../services/api.js'

export const loginUser = async (userData)=>{
    const response = await api.post("/api/auth/login",userData);
    return response.data;
}

export const registerUser = async (userData) => {
    const response = await api.post("/api/auth/register",userData);
    return response.data;
}

export const logout = async ()=>{
    const response = await api.post("/api/auth/logout");
    return response.data;
}

export const refreshToken = async ()=>{
    const response = await api.post("/api/auth/refresh");
    return response.data
}

export const getUser = async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
}

