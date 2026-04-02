import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5016/api",
});

//request interceptor to add the token to the headers
axiosInstance.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user;

  if (user?.token) {
    config.headers["Authorization"] = `Bearer ${user.token}`;
  }

  return config;
});

//response interceptor to handle 401 errors and refresh the token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
