import axios from "axios";

const baseURL = "/api";

const api = axios.create({
  baseURL,
  timeout: 1000,
});

export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};
