import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hireflow-api-fwpe.onrender.com";

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_BASE_URL = BASE_URL;
