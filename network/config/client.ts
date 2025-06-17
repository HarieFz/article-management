import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { getCookie } from "cookies-next";
import { decrypt } from "@/lib/crypto";

export const client = (() => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Accept: "application/json, text/plain, */*, multipart/form-data",
    },
  });
})();

// Request Interceptor
client.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const cookie = getCookie("token");
      if (cookie) {
        const session = await decrypt(cookie);
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
