"use client";

import { useParams } from "next/navigation";
import { RouteGuard } from "@/components/shared/route-guard";
import { useJob } from "@/hooks/useJobs";
import { JobForm } from "@/components/employer/job-form";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";

export default function EditJobPage() {
  return (
    <RouteGuard roles={["EMPLOYER", "ADMIN"]}>
      <EditJob />
    </RouteGuard>
  );
}

function EditJob() {
  const params = useParams<{ id: string }>();
  const { data: job, isLoading, isError, refetch } = useJob(params.id);

  if (isLoading) return <Loading />;
  if (isError || !job)
    return <ErrorState message="Job not found." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Edit: {job.title}
      </h1>
      <JobForm companyId={job.companyId} initialJob={job} />
    </div>
  );
}
