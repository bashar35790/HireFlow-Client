"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { JobStatusChip } from "@/components/jobs/status-chips";
import { JOB_STATUS_LABEL, JOB_TYPES_MAP } from "@/lib/constants";
import { formatSalary, formatDate } from "@/lib/format";

export default function EmployerJobsPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <JobsManage />
    </RouteGuard>
  );
}

function JobsManage() {
  const { user } = useAuth();
  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
    refetch: refetchCompany,
  } = useMyCompany(user?.id);
  const { data: myJobs, isLoading, isError, refetch } = useMyJobs(company?.id);
  const deleteJob = useDeleteJob();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (companyLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  if (companyError)
    return (
      <ErrorState
        message="Failed to load your company."
        onRetry={() => refetchCompany()}
      />
    );
  if (isError)
    return (
      <ErrorState
        message="Failed to load your jobs."
        onRetry={() => refetch()}
      />
    );

  if (!company) {
    return (
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <EmptyState
          title="You need a company first"
          description="Create your company profile before posting premium jobs."
          actionLabel="Create Company"
          actionHref="/employer/company"
          icon={
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          }
        />
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteJob.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Employer · {company.name}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            My Jobs
          </h1>
          <p className="mt-2 text-base font-light text-foreground/60">
            Create, update and manage your job postings.
          </p>
        </div>
        <Link
          href="/employer/jobs/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Job
        </Link>
      </motion.div>

      {/* ── Job list ── */}
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loading />
        </div>
      ) : myJobs && myJobs.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {myJobs.data.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group rounded-2xl bg-card border border-[var(--card-border)] p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Top row */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-lg font-bold text-primary shadow-inner">
                  {job.title[0]}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-foreground leading-tight">
                        {job.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-foreground/50">
                        {JOB_TYPES_MAP[job.jobType]}
                        {job.location && <> · {job.location}</>}
                        {formatSalary(job.salaryMin, job.salaryMax) && (
                          <> · {formatSalary(job.salaryMin, job.salaryMax)}</>
                        )}
                      </p>
                    </div>
                    <JobStatusChip status={job.status}>
                      {JOB_STATUS_LABEL[job.status]}
                    </JobStatusChip>
                  </div>

                  <p className="mt-1.5 text-xs text-foreground/40">
                    Created {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 flex items-center gap-2 border-t border-[var(--card-border)] pt-4">
                <Link
                  href={`/employer/jobs/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/10 to-[#f04c24]/5 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary transition-all hover:from-primary/20 hover:border-primary/40"
                >
                  View & Applicants
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={`/employer/jobs/${job.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-400 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/20"
                >
                  {deletingId === job.id ? (
                    <>
                      <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting…
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs yet"
          description="Create your first premium job posting and start attracting exceptional candidates."
          actionLabel="Create a Job"
          actionHref="/employer/jobs/new"
          icon={
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
        />
      )}
    </div>
  );
}
