"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, type UpdateUserPayload } from "@/services/user.service";

export const userKeys = {
  all: ["users"] as const,
  list: (page: number, limit: number) => [...userKeys.all, page, limit] as const,
};

export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: userKeys.list(page, limit),
    queryFn: () => userService.list(page, limit),
    placeholderData: (previous) => previous,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}