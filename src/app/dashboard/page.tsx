"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  useMyApplications,
  useDeleteApplication,
} from "@/hooks/useApplications";
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
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Job Seeker Dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My Applications
        </h1>
        <p className="mt-2 text-base font-light text-foreground/60">
          Track the status of every role you&apos;ve applied to.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorState
          message="Could not load your applications."
          onRetry={() => refetch()}
        />
      ) : data && data.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data.data.map((application, i) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group rounded-2xl bg-card border border-[var(--card-border)] p-5 shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Company avatar */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-lg font-bold text-primary shadow-inner">
                  {application.job?.company?.name?.[0] ?? "J"}
                </div>

                {/* Job info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-foreground leading-tight">
                        {application.job?.title ?? "Job"}
                      </h2>
                      <p className="mt-0.5 text-sm text-foreground/60">
                        {application.job?.company?.name}
                        {application.job?.location && (
                          <>
                            <span className="mx-1.5 text-foreground/30">·</span>
                            {application.job.location}
                          </>
                        )}
                      </p>
                    </div>
                    <ApplicationStatusChip status={application.status} />
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/50">
                    {application.job?.salaryMin != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f04c24]/10 px-2.5 py-0.5 text-xs font-semibold text-[#f04c24]">
                        {formatSalary(
                          application.job.salaryMin,
                          application.job.salaryMax,
                        )}
                      </span>
                    )}
                    <span>Applied {formatDate(application.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 flex items-center gap-2 border-t border-[var(--card-border)] pt-4">
                {application.job && (
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    View Job
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(application.id)}
                  disabled={deletingId === application.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-400 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/20"
                >
                  {deletingId === application.id ? (
                    <>
                      <svg
                        className="h-3 w-3 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Withdrawing…
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Browse our curated job collection and apply to start tracking your applications here."
          actionLabel="Browse Jobs"
          actionHref="/jobs"
          icon={
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
          }
        />
      )}
    </div>
  );
}
