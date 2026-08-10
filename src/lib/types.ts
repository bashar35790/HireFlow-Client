export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string | Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type UserRole = "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type CompanyStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CategoryStatus = "ACTIVE" | "INACTIVE";
export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type ReviewStatus = "ACTIVE" | "HIDDEN";
export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  company?: Company | null;
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  location: string;
  status: CompanyStatus;
  ownerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string;
  jobType: string;
  experienceLevel: string | null;
  companyId: string;
  categoryId: string | null;
  status: JobStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  category?: Category | null;
  _count?: {
    applications: number;
    savedJobs: number;
  };
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resume: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  job?: Job;
}

export interface Review {
  id: string;
  userId: string;
  companyId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  company?: Company;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job?: Job;
}