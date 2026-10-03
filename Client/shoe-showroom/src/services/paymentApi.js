import api from '../services/api'


export const createPayment = async (orderId)=>{
    const response = await api.post(`/api/payments/create/${orderId}`);
    return response.data;
}