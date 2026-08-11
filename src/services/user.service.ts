import { api } from "@/lib/axios";
import type {
  ApiResponse,
  PaginationMeta,
  User,
  UserRole,
  UserStatus,
} from "@/lib/types";

export interface UpdateUserPayload {
  name?: string;
  status?: UserStatus;
  role?: UserRole;
}

interface UserListResponse {
  data: User[];
  meta: PaginationMeta;
}

export const userService = {
  async list(page = 1, limit = 10): Promise<UserListResponse> {
    const { data } = await api.get<ApiResponse<User[]>>("/users", {
      params: { page, limit },
    });
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(
      `/users/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/users/${id}`);
  },
};
