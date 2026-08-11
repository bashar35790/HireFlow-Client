import { api } from "@/lib/axios";
import type { ApiResponse, PaginationMeta, SavedJob } from "@/lib/types";

interface SavedJobListResponse {
  data: SavedJob[];
  meta: PaginationMeta;
}

export const savedJobService = {
  async save(jobId: string): Promise<SavedJob> {
    const { data } = await api.post<ApiResponse<SavedJob>>("/saved-jobs", {
      jobId,
    });
    return data.data;
  },

  async getMy(page = 1, limit = 10): Promise<SavedJobListResponse> {
    const { data } = await api.get<ApiResponse<SavedJob[]>>("/saved-jobs/my", {
      params: { page, limit },
    });
    return { data: data.data, meta: data.meta! };
  },

  async unsave(jobId: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/saved-jobs/${jobId}`);
  },
};
