"use client";

import Link from "next/link";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { CompanyForm } from "@/components/employer/company-form";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@heroui/react";

export default function CompanyPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <CompanyManage />
    </RouteGuard>
  );
}

function CompanyManage() {
  const { user } = useAuth();
  const { data: company, isLoading, isError, refetch } = useMyCompany(user?.id);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message="Failed to load your company." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Company Profile</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {company ? "Update your company details" : "Set up your company"}
          </p>
        </div>
        {company && (
          <Link href="/employer">
            <Button variant="ghost" size="sm">
              Back to dashboard
            </Button>
          </Link>
        )}
      </div>
      <CompanyForm initialCompany={company ?? undefined} />
    </div>
  );
}