"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applicationService,
  type CreateApplicationPayload,
} from "@/services/application.service";
import type { ApplicationStatus } from "@/lib/types";
import { jobKeys } from "./useJobs";

export const applicationKeys = {
  all: ["applications"] as const,
  my: (page: number, limit: number) =>
    [...applicationKeys.all, "my", page, limit] as const,
  detail: (id: string) => [...applicationKeys.all, "detail", id] as const,
};

export function useMyApplications(page = 1, limit = 10, enabled = true) {
  return useQuery({
    queryKey: applicationKeys.my(page, limit),
    queryFn: () => applicationService.getMy(page, limit),
    placeholderData: (previous) => previous,
    enabled,
  });
}

export function useAllApplications(
  filters: {
    jobId?: string;
    status?: ApplicationStatus;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery({
    queryKey: [...applicationKeys.all, "all", filters],
    queryFn: () => applicationService.listAll(filters),
  });
}

export function useApplication(id?: string) {
  return useQuery({
    queryKey: applicationKeys.detail(id ?? ""),
    queryFn: () => applicationService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) =>
      applicationService.apply(payload),
    onSuccess: (application) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({
        queryKey: jobKeys.detail(application.jobId),
      });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}
