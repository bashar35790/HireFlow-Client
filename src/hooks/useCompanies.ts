"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  companyService,
  type CompanyFilters,
  type CreateCompanyPayload,
  type UpdateCompanyPayload,
} from "@/services/company.service";

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: CompanyFilters) => [...companyKeys.lists(), filters] as const,
  detail: (id: string) => [...companyKeys.all, "detail", id] as const,
};

export function useCompanies(filters: CompanyFilters = {}) {
  return useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () => companyService.list(filters),
    placeholderData: (previous) => previous,
  });
}

export function useCompany(id?: string) {
  return useQuery({
    queryKey: companyKeys.detail(id ?? ""),
    queryFn: () => companyService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useMyCompany(ownerId?: string) {
  return useQuery({
    queryKey: [...companyKeys.lists(), "mine", ownerId ?? ""],
    queryFn: async () => {
      const { data } = await companyService.list({ limit: 100 });
      return data.find((c) => c.ownerId === ownerId) ?? null;
    },
    enabled: Boolean(ownerId),
    placeholderData: (previous) => previous,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companyService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCompanyPayload }) =>
      companyService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companyService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }),
  });
}