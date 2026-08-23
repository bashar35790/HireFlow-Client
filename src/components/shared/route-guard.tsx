"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/lib/types";
import { useCurrentUser } from "@/hooks/useAuth";
import { Loading } from "./loading";

interface RouteGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

export function RouteGuard({
  children,
  roles,
  redirectTo = "/login",
}: RouteGuardProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [isLoading, user, roles?.join(","), redirectTo, router]);

  if (isLoading || !user || (roles && !roles.includes(user.role))) {
    return <Loading label="Checking access…" />;
  }

  return <>{children}</>;
}
