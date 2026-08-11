import { api } from "@/lib/axios";
import type {
  ApiResponse,
  Application,
  ApplicationStatus,
  PaginationMeta,
} from "@/lib/types";

export interface CreateApplicationPayload {
  jobId: string;
  resume?: string;
  coverLetter?: string;
}

export interface ApplicationFilters {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

interface ApplicationListResponse {
  data: Application[];
  meta: PaginationMeta;
}

export const applicationService = {
  async apply(payload: CreateApplicationPayload): Promise<Application> {
    const { data } = await api.post<ApiResponse<Application>>(
      "/applications",
      payload,
    );
    return data.data;
  },

  async listAll(
    filters: ApplicationFilters = {},
  ): Promise<ApplicationListResponse> {
    const params = Object.entries(filters).reduce<
      Record<string, string | number>
    >((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
    const { data } = await api.get<ApiResponse<Application[]>>(
      "/applications",
      { params },
    );
    return { data: data.data, meta: data.meta! };
  },

  async getMy(page = 1, limit = 10): Promise<ApplicationListResponse> {
    const { data } = await api.get<ApiResponse<Application[]>>(
      "/applications/my",
      {
        params: { page, limit },
      },
    );
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<Application> {
    const { data } = await api.get<ApiResponse<Application>>(
      `/applications/${id}`,
    );
    return data.data;
  },

  async getStatus(id: string): Promise<ApplicationStatus> {
    const { data } = await api.get<ApiResponse<ApplicationStatus>>(
      `/applications/${id}/status`,
    );
    return data.data;
  },

  async updateStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const { data } = await api.patch<ApiResponse<Application>>(
      `/applications/${id}/status`,
      {
        status,
      },
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/applications/${id}`);
  },
};
