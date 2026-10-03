import api from '../services/api';

export const addToCart = async (shoeId , shoeSize)=>{
    const response = await api.post(`/api/cart/${shoeId}/${shoeSize}`);
    return response.data;
}

export const increaseQuantity = async (shoeId,shoeSize) => {
    const response = await api.patch(`/api/cart/increase/${shoeId}/${shoeSize}`);
    return response.data;
}


export const decreaseQuantity = async (shoeId,shoeSize)=>{
    const response = await api.patch(`/api/cart/decrease/${shoeId}/${shoeSize}`)
    return response.data;
}

export const removeItemFromCart = async (shoeId,shoeSize)=>{
    const response = await api.delete(`/api/cart/remove/${shoeId}/${shoeSize}`)
    return response.data;
}

export const getCart = async ()=>{
    const response = await api.get("/api/cart");
    return response.data;
}

