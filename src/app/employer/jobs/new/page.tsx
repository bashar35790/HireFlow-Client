"use client";

import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { JobForm } from "@/components/employer/job-form";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";

export default function NewJobPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <NewJob />
    </RouteGuard>
  );
}

function NewJob() {
  const { user } = useAuth();
  const { data: company, isLoading } = useMyCompany(user?.id);

  if (isLoading) return <Loading />;

  if (!company) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="You need a company to post jobs"
          description="Create your company profile first."
          actionLabel="Create company"
          actionHref="/employer/company"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create a new job</h1>
      <JobForm companyId={company.id} />
    </div>
  );
}