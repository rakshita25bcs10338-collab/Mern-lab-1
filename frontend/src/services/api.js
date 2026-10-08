import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8006",
  withCredentials: true, // sends the HttpOnly cookie automatically
});

export default api;