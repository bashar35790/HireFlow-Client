import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hireflow-api-fwpe.onrender.com";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const API_BASE_URL = BASE_URL;
