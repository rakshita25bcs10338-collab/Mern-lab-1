import api from "./api";

// All product API calls live here so components stay free of request logic.
export const getProducts = ({ search, category, sort } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  if (sort) params.sort = sort;
  return api.get("/products", { params });
};

export const getProductById = (id) => api.get(`/products/${id}`);