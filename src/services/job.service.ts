import { api } from "@/lib/axios";
import type { ApiResponse, Job, JobStatus, PaginationMeta } from "@/lib/types";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";

export interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: JobType;
  experienceLevel?: ExperienceLevel;
  companyId: string;
  categoryId: string;
  status?: JobStatus;
}

export type UpdateJobPayload = Partial<CreateJobPayload>;

interface JobListResponse {
  data: Job[];
  meta: PaginationMeta;
}

export const jobService = {
  async list(filters: JobFilters = {}): Promise<JobListResponse> {
    const params = Object.entries(filters).reduce<Record<string, string | number>>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs", { params });
    return { data: data.data, meta: data.meta! };
  },

  async getMine(companyId?: string): Promise<JobListResponse> {
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs/mine", {
      params: companyId ? { companyId } : {},
    });
    return { data: data.data, meta: data.meta! };
  },

  async getById(id: string): Promise<Job> {
    const { data } = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return data.data;
  },

  async create(payload: CreateJobPayload): Promise<Job> {
    const { data } = await api.post<ApiResponse<Job>>("/jobs", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateJobPayload): Promise<Job> {
    const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/jobs/${id}`);
  },
};