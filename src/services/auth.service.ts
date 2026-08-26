import { api, setAuthToken } from "@/lib/axios";
import type { ApiResponse, User } from "@/lib/types";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "JOB_SEEKER" | "EMPLOYER";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User & { token?: string }>>(
      "/auth/register",
      payload,
    );
    if (data.data.token) setAuthToken(data.data.token);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User & { token?: string }>>(
      "/auth/login",
      payload,
    );
    if (data.data.token) setAuthToken(data.data.token);
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post<ApiResponse<null>>("/auth/logout");
    setAuthToken(null);
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },
};
