"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import { useMyApplications, useDeleteApplication } from "@/hooks/useApplications";
import { RouteGuard } from "@/components/shared/route-guard";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ApplicationStatusChip } from "@/components/jobs/status-chips";
import { formatSalary, formatDate } from "@/lib/format";
import { useState } from "react";

export default function DashboardPage() {
  return (
    <RouteGuard roles={["JOB_SEEKER"]}>
      <MyApplications />
    </RouteGuard>
  );
}

function MyApplications() {
  const { data, isLoading, isError, refetch } = useMyApplications(1, 10);
  const deleteApp = useDeleteApplication();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Withdraw this application?")) return;
    setDeletingId(id);
    try {
      await deleteApp.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        My Applications
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Track the status of your job applications
      </p>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState message="Could not load your applications." onRetry={() => refetch()} />
      ) : data && data.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data.data.map((application) => (
            <Card key={application.id} variant="secondary">
              <Card.Header className="gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {application.job?.company?.name?.[0] ?? "J"}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                    {application.job?.title ?? "Job"}
                  </h2>
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {application.job?.company?.name} · {application.job?.location}
                  </p>
                </div>
                <ApplicationStatusChip status={application.status} />
              </Card.Header>
              <Card.Content className="gap-2">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  {application.job?.salaryMin != null && (
                    <span className="mr-3">{formatSalary(application.job.salaryMin, application.job.salaryMax)}</span>
                  )}
                  <span>Applied {formatDate(application.createdAt)}</span>
                </div>
              </Card.Content>
              <Card.Footer className="gap-2">
                {application.job && (
                  <Link href={`/jobs/${application.job.id}`}>
                    <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
                      View job
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(application.id)}
                  disabled={deletingId === application.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  {deletingId === application.id ? "Withdrawing…" : "Withdraw"}
                </button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Browse jobs and apply to start tracking your applications here."
          actionLabel="Browse jobs"
          actionHref="/jobs"
        />
      )}
    </div>
  );
}