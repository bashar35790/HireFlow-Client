import type { ApplicationStatus, JobStatus } from "@/lib/types";

export const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
] as const;

export const JOB_TYPES_MAP: Record<string, string> = Object.fromEntries(
  JOB_TYPES.map((t) => [t.value, t.label]),
);

export const EXPERIENCE_LEVELS_MAP: Record<string, string> = Object.fromEntries(
  EXPERIENCE_LEVELS.map((t) => [t.value, t.label]),
);

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "CLOSED", label: "Closed" },
];

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
};

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

const green = "success" as const;
const yellow = "warning" as const;
const red = "danger" as const;
const blue = "accent" as const;
const neutral = "default" as const;

export const jobStatusChipColor: Record<
  JobStatus,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  DRAFT: neutral,
  PUBLISHED: green,
  CLOSED: red,
};

export const applicationStatusChipColor: Record<
  ApplicationStatus,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  PENDING: yellow,
  REVIEWING: blue,
  SHORTLISTED: blue,
  REJECTED: red,
  ACCEPTED: green,
};

export const companyStatusChipColor: Record<
  string,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  PENDING: yellow,
  APPROVED: green,
  REJECTED: red,
};

export const userStatusChipColor: Record<
  string,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  ACTIVE: green,
  INACTIVE: neutral,
  BLOCKED: red,
};
