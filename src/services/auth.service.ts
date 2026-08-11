import { api } from "@/lib/axios";
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
    const { data } = await api.post<ApiResponse<User>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  async login(payload: LoginPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>("/auth/login", payload);
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post<ApiResponse<null>>("/auth/logout");
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },
};
