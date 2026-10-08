import api from "./api";

export const getCart = () => api.get("/cart");
export const addToCart = (id) => api.post(`/cart/${id}`);
export const updateCartQuantity = (id, quantity) => api.patch(`/cart/${id}`, { quantity });
export const removeFromCart = (id) => api.delete(`/cart/${id}`);