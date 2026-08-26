"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Job } from "@/lib/types";
import { useCreateJob, useUpdateJob } from "@/hooks/useJobs";
import { useCategories } from "@/hooks/useCategories";
import { EXPERIENCE_LEVELS, JOB_STATUSES, JOB_TYPES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/error-message";

const jobSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(10000),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(200),
    jobType: z.enum([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "INTERNSHIP",
      "REMOTE",
    ]),
    experienceLevel: z
      .enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"])
      .optional()
      .or(z.literal("")),
    categoryId: z.string().min(1, "Choose a category"),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  })
  .superRefine((data, ctx) => {
    const min = Number(data.salaryMin);
    const max = Number(data.salaryMax);
    if (data.salaryMin && data.salaryMax && min > max) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "Maximum salary must be greater than or equal to minimum",
      });
    }
    if (data.salaryMin && min < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMin"],
        message: "Salary cannot be negative",
      });
    }
  });

type JobValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  companyId: string;
  initialJob?: Job;
}

const inputCls =
  "w-full rounded-xl border border-[var(--card-border)] bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer";

const labelCls =
  "text-xs font-semibold uppercase tracking-widest text-foreground/50";

const chevronIcon = (
  <svg
    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export function JobForm({ companyId, initialJob }: JobFormProps) {
  const router = useRouter();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const { data: categories } = useCategories();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(initialJob);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialJob?.title ?? "",
      description: initialJob?.description ?? "",
      location: initialJob?.location ?? "",
      jobType: (initialJob?.jobType ?? "FULL_TIME") as JobValues["jobType"],
      experienceLevel: (initialJob?.experienceLevel ??
        "") as JobValues["experienceLevel"],
      categoryId: initialJob?.categoryId ?? "",
      salaryMin:
        initialJob?.salaryMin != null ? String(initialJob.salaryMin) : "",
      salaryMax:
        initialJob?.salaryMax != null ? String(initialJob.salaryMax) : "",
      status: (initialJob?.status ?? "DRAFT") as JobValues["status"],
    },
  });

  async function onSubmit(values: JobValues) {
    setFormError(null);
    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      jobType: values.jobType,
      experienceLevel: values.experienceLevel || undefined,
      categoryId: values.categoryId,
      companyId,
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      status: values.status,
    };
    try {
      if (initialJob) {
        await updateJob.mutateAsync({ id: initialJob.id, payload });
      } else {
        await createJob.mutateAsync(payload);
      }
      router.push("/employer/jobs");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--card-border)] bg-card p-8 shadow-xl shadow-primary/5 sm:p-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#f04c24] text-white shadow-lg shadow-primary/20">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {isEdit ? "Edit Listing" : "New Listing"}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            {isEdit ? "Edit job" : "Create a new job"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {formError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/40 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className={labelCls}>
            Job Title <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </span>
            <input
              {...register("title")}
              placeholder="e.g. Senior Product Designer"
              className={`${inputCls} pl-10`}
            />
          </div>
          {errors.title && (
            <p className="text-xs font-medium text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>
            Description <span className="text-primary">*</span>
          </label>
          <textarea
            {...register("description")}
            rows={6}
            placeholder="Describe the role, responsibilities and requirements…"
            className={`${inputCls} resize-none`}
          />
          {errors.description && (
            <p className="text-xs font-medium text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelCls}>
              Location <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <input
                {...register("location")}
                placeholder="e.g. Dhaka, Bangladesh"
                className={`${inputCls} pl-10`}
              />
            </div>
            {errors.location && (
              <p className="text-xs font-medium text-red-500">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelCls}>
              Category <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("categoryId")}
                className={inputCls}
              >
                <option value="">Select a category</option>
                {categories?.data.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {chevronIcon}
            </div>
            {errors.categoryId && (
              <p className="text-xs font-medium text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelCls}>
              Job Type <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register("jobType")}
                className={inputCls}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {chevronIcon}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelCls}>Experience Level</label>
            <div className="relative">
              <select
                {...register("experienceLevel")}
                className={inputCls}
              >
                <option value="">Any</option>
                {EXPERIENCE_LEVELS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {chevronIcon}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelCls}>Salary Minimum (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/40">
                $
              </span>
              <input
                {...register("salaryMin")}
                type="number"
                placeholder="1000"
                className={`${inputCls} pl-9`}
              />
            </div>
            {errors.salaryMin && (
              <p className="text-xs font-medium text-red-500">
                {errors.salaryMin.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelCls}>Salary Maximum (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/40">
                $
              </span>
              <input
                {...register("salaryMax")}
                type="number"
                placeholder="3000"
                className={`${inputCls} pl-9`}
              />
            </div>
            {errors.salaryMax && (
              <p className="text-xs font-medium text-red-500">
                {errors.salaryMax.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:max-w-xs">
          <label className={labelCls}>Status</label>
          <div className="relative">
            <select
              {...register("status")}
              className={inputCls}
            >
              {JOB_STATUSES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {chevronIcon}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--card-border)] pt-6">
          <button
            type="submit"
            disabled={createJob.isPending || updateJob.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createJob.isPending || updateJob.isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Job"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground/70 transition-all hover:border-foreground/40 hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
