import api from '../services/api'


export const checkout = async () => {
    const response = await api.post("/api/orders/checkout")
    return response.data
};

export const getOrders = async ()=>{
    const resposne = await api.get("/api/orders");
    return resposne.data;
}

export const getOrderById = async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data;
}

export const cancelOrder = async (orderId)=>{
    const response = await api.patch(`/api/orders/${orderId}/cancel`);
    return response.data;
}

export const getAllOrders = async () => {
    const response = await api.get("/api/orders/admin/orders");
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(
        `/api/orders/admin/${orderId}/status`,
        { status }
    );

    return response.data;
};