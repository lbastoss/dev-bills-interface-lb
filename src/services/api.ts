import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { firebaseAuth } from "../config/firebase";

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.set("Authorization", `Bearer ${token}`);
      } catch (err) {
        console.error("error getting user token from firebase", err);
      }
    }

    return config;
  },
);
