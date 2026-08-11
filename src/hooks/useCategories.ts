"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.list(1, 100),
    placeholderData: (previous) => previous,
  });
}
