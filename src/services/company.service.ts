import { api } from "@/lib/axios";
import type { ApiResponse, Company, CompanyStatus, PaginationMeta } from "@/lib/types";

export interface CompanyFilters {
  status?: CompanyStatus;
  page?: number;
  limit?: number;
}

export interface CreateCompanyPayload {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location: string;
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload> & {
  status?: CompanyStatus;
};

interface CompanyListResponse {
  data: Company[];
  meta: PaginationMeta;
}

export const companyService = {
  async list(filters: CompanyFilters = {}): Promise<CompanyListResponse> {
    const params = Object.entries(filters).reduce<Record<string, string | number>>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const { data } = await api.get<ApiResponse<Company[]>>("/companies", { params });
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<Company> {
    const { data } = await api.get<ApiResponse<Company>>(`/companies/${id}`);
    return data.data;
  },

  async create(payload: CreateCompanyPayload): Promise<Company> {
    const { data } = await api.post<ApiResponse<Company>>("/companies", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateCompanyPayload): Promise<Company> {
    const { data } = await api.patch<ApiResponse<Company>>(`/companies/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/companies/${id}`);
  },
};