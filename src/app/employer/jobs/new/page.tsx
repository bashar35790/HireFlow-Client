"use client";

import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { JobForm } from "@/components/employer/job-form";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
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
  const { data: company, isLoading, isError, refetch } = useMyCompany(user?.id);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState
        message="Failed to load your company."
        onRetry={() => refetch()}
      />
    );

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
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#f04c24]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Post a Job
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-primary to-[#f04c24] bg-clip-text text-transparent">
              Great Hire
            </span>
          </h1>
          <p className="mt-2 text-sm font-light text-foreground/60">
            Fill in the details below to publish your job listing.
          </p>
        </div>

        <JobForm companyId={company.id} />
      </div>
    </div>
  );
}
