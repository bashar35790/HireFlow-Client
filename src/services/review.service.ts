import { api } from "@/lib/axios";
import type { ApiResponse, PaginationMeta, Review } from "@/lib/types";

export interface CreateReviewPayload {
  companyId: string;
  rating: number;
  comment?: string;
}

export type UpdateReviewPayload = Partial<Omit<CreateReviewPayload, "companyId">>;

interface ReviewListResponse {
  data: Review[];
  meta: PaginationMeta;
}

export const reviewService = {
  async list(companyId?: string, page = 1, limit = 10): Promise<ReviewListResponse> {
    const { data } = await api.get<ApiResponse<Review[]>>("/reviews", {
      params: {
        ...(companyId ? { companyId } : {}),
        page,
        limit,
      },
    });
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<Review> {
    const { data } = await api.get<ApiResponse<Review>>(`/reviews/${id}`);
    return data.data;
  },

  async create(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await api.post<ApiResponse<Review>>("/reviews", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateReviewPayload): Promise<Review> {
    const { data } = await api.patch<ApiResponse<Review>>(`/reviews/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/reviews/${id}`);
  },
};