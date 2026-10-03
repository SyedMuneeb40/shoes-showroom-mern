import api from '../services/api'


export const getShoes = async ()=>{
    const response = await api.get("/api/shoes")
    return response.data;
}

export const getShoesById = async (shoeId)=>{
    const response = await api.get(`/api/shoes/${shoeId}`)
    return response.data;
}

export const createShoe = async (shoeData)=>{
    const response = await api.post("/api/shoes",shoeData)
    return response.data;
}

export const updateShoe = async (shoeId,shoeData)=>{
    const response = await api.put(`/api/shoes/${shoeId}`,shoeData);
    return response.data;
}

export const deleteShoe = async (shoeId)=>{
    const response = await api.delete(`/api/shoes/${shoeId}`)
    return response.data;
}

