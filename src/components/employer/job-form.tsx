"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
} from "@heroui/react";
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
    setValue,
    watch,
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

  const jobType = watch("jobType");
  const experienceLevel = watch("experienceLevel");
  const status = watch("status");

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
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>{isEdit ? "Edit job" : "Create a new job"}</Card.Title>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Title</Label>
            <Input
              {...register("title")}
              placeholder="e.g. Senior Product Designer"
              className="w-full"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Description</Label>
            <TextArea
              {...register("description")}
              rows={6}
              placeholder="Describe the role, responsibilities and requirements…"
              className="w-full"
            />
            {errors.description && (
              <p className="text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Location</Label>
              <Input
                {...register("location")}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full"
              />
              {errors.location && (
                <p className="text-xs text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                className="w-full"
                placeholder="Select a category"
                value={watch("categoryId") || null}
                onChange={(value) =>
                  setValue("categoryId", value ? String(value) : "", {
                    shouldValidate: true,
                  })
                }
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {categories?.data.map((c) => (
                      <ListBox.Item key={c.id} id={c.id} textValue={c.name}>
                        {c.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Job type</Label>
              <Select
                className="w-full"
                value={jobType}
                onChange={(value) =>
                  setValue(
                    "jobType",
                    (value as JobValues["jobType"]) || "FULL_TIME",
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {JOB_TYPES.map((t) => (
                      <ListBox.Item
                        key={t.value}
                        id={t.value}
                        textValue={t.label}
                      >
                        {t.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Experience level</Label>
              <Select
                className="w-full"
                placeholder="Any"
                value={experienceLevel || null}
                onChange={(value) =>
                  setValue(
                    "experienceLevel",
                    (value as JobValues["experienceLevel"]) || "",
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {EXPERIENCE_LEVELS.map((t) => (
                      <ListBox.Item
                        key={t.value}
                        id={t.value}
                        textValue={t.label}
                      >
                        {t.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Salary minimum (USD)
              </Label>
              <Input
                {...register("salaryMin")}
                type="number"
                placeholder="1000"
                className="w-full"
              />
              {errors.salaryMin && (
                <p className="text-xs text-red-600">
                  {errors.salaryMin.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Salary maximum (USD)
              </Label>
              <Input
                {...register("salaryMax")}
                type="number"
                placeholder="3000"
                className="w-full"
              />
              {errors.salaryMax && (
                <p className="text-xs text-red-600">
                  {errors.salaryMax.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              className="w-full sm:max-w-xs"
              value={status}
              onChange={(value) =>
                setValue("status", (value as JobValues["status"]) || "DRAFT")
              }
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {JOB_STATUSES.map((t) => (
                    <ListBox.Item
                      key={t.value}
                      id={t.value}
                      textValue={t.label}
                    >
                      {t.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isDisabled={createJob.isPending || updateJob.isPending}
            >
              {createJob.isPending || updateJob.isPending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create job"}
            </Button>
            <Button variant="ghost" size="lg" onPress={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
