import { api } from "@/lib/axios";
import type { ApiResponse, Category, PaginationMeta } from "@/lib/types";

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  status?: "ACTIVE" | "INACTIVE";
};

interface CategoryListResponse {
  data: Category[];
  meta: PaginationMeta;
}

export const categoryService = {
  async list(page = 1, limit = 100): Promise<CategoryListResponse> {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories", {
      params: { page, limit },
    });
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data;
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await api.post<ApiResponse<Category>>(
      "/categories",
      payload,
    );
    return data.data;
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const { data } = await api.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};
