"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth.service";
import type { User } from "@/lib/types";

export const authKeys = {
  me: ["auth", "me"] as const,
  all: ["auth"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async (): Promise<User | null> => {
      try {
        return await authService.getMe();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries();
    },
  });
}

export function useAuth() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: Boolean(user),
    isJobSeeker: user?.role === "JOB_SEEKER",
    isEmployer: user?.role === "EMPLOYER",
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };
}
