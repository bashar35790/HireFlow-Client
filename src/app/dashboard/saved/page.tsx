"use client";

import { Button } from "@heroui/react";
import { useSavedJobs, useUnsaveJob } from "@/hooks/useSavedJobs";
import { RouteGuard } from "@/components/shared/route-guard";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { JobCard } from "@/components/jobs/job-card";

export default function SavedJobsPage() {
  return (
    <RouteGuard roles={["JOB_SEEKER"]}>
      <SavedJobs />
    </RouteGuard>
  );
}

function SavedJobs() {
  const { data, isLoading, isError, refetch } = useSavedJobs(1, 10);
  const unsave = useUnsaveJob();

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-foreground">Saved Jobs</h1>
      <p className="mb-8 text-foreground/60">
        Jobs you&apos;ve bookmarked to apply later
      </p>

      {isError ? (
        <ErrorState
          message="Could not load saved jobs."
          onRetry={() => refetch()}
        />
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.data.map((saved) =>
              saved.job ? (
                <div key={saved.id} className="flex flex-col gap-2">
                  <JobCard job={saved.job} />
                  <Button
                    variant="ghost"
                    size="sm"
                    isDisabled={unsave.isPending}
                    onPress={() => unsave.mutate(saved.jobId)}
                  >
                    Remove from saved
                  </Button>
                </div>
              ) : null,
            )}
          </div>
        </>
      ) : (
        <EmptyState
          title="No saved jobs"
          description="Save jobs you're interested in to find them here later."
          actionLabel="Browse jobs"
          actionHref="/jobs"
        />
      )}
    </div>
  );
}
