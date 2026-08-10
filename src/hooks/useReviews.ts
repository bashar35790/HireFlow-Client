"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService, type CreateReviewPayload, type UpdateReviewPayload } from "@/services/review.service";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (companyId?: string) => [...reviewKeys.all, "list", companyId ?? "all"] as const,
};

export function useReviews(companyId?: string) {
  return useQuery({
    queryKey: reviewKeys.list(companyId),
    queryFn: () => reviewService.list(companyId, 1, 50),
    placeholderData: (previous) => previous,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.create(payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(review.companyId) });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      reviewService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}