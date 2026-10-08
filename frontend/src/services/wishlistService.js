import axios from 'axios'

const API = 'http://localhost:8006/wishlist'
const config = { withCredentials: true }

export const getWishlist = () => axios.get(API, config)
export const addToWishlist = (id) => axios.post(`${API}/${id}`, {}, config)
export const removeFromWishlist = (id) => axios.delete(`${API}/${id}`, config)