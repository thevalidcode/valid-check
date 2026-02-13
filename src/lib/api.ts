import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Basic response interceptor placeholder (centralized error handling can be added)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
