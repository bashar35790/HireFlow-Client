"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedJobService } from "@/services/saved-job.service";
import type { SavedJob } from "@/lib/types";
import { jobKeys } from "./useJobs";

export const savedJobKeys = {
  all: ["saved-jobs"] as const,
  my: (page: number, limit: number) =>
    [...savedJobKeys.all, "my", page, limit] as const,
};

export function useSavedJobs(page = 1, limit = 10) {
  return useQuery({
    queryKey: savedJobKeys.my(page, limit),
    queryFn: () => savedJobService.getMy(page, limit),
    placeholderData: (previous) => previous,
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => savedJobService.save(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.details() });
    },
  });
}

export function useSavedJobIds() {
  return useQuery({
    queryKey: [...savedJobKeys.all, "ids"],
    queryFn: () => savedJobService.getMy(1, 100),
    select: (res): Set<string> => new Set(res.data.map((s: SavedJob) => s.jobId)),
    staleTime: 1000 * 30,
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => savedJobService.unsave(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.details() });
    },
  });
}
