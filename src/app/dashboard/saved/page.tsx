"use client";

import { motion } from "framer-motion";
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

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );

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
          Saved Jobs
        </h1>
        <p className="mt-2 text-base font-light text-foreground/60">
          Roles you&apos;ve bookmarked — apply when you&apos;re ready.
        </p>
      </motion.div>

      {isError ? (
        <ErrorState
          message="Could not load saved jobs."
          onRetry={() => refetch()}
        />
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.data.map((saved, i) =>
            saved.job ? (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group flex flex-col gap-2"
              >
                {/* ── Same shell as jobs page ── */}
                <div className="h-full rounded-3xl bg-card p-2 transition-all hover:shadow-2xl hover:shadow-primary/10">
                  <div className="h-full rounded-2xl bg-background border border-[var(--card-border)] p-6 transition-colors group-hover:border-primary/20">
                    <JobCard job={saved.job} />
                  </div>
                </div>

                {/* Unsave button — below the card, full-width red pill */}
                <button
                  onClick={() => unsave.mutate(saved.jobId)}
                  disabled={unsave.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-400 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/20"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {unsave.isPending ? "Removing…" : "Remove from Saved"}
                </button>
              </motion.div>
            ) : null,
          )}
        </div>
      ) : (
        <EmptyState
          title="No saved jobs yet"
          description="Browse our premium job collection and save roles you're interested in to find them here."
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
        />
      )}
    </div>
  );
}
