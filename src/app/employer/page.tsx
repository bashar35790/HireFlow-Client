"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { useMyJobs } from "@/hooks/useJobs";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { JobStatusChip } from "@/components/jobs/status-chips";
import { JOB_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";

const STATUS_COLORS: Record<string, string> = {
  APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function EmployerDashboardPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <EmployerDashboard />
    </RouteGuard>
  );
}

function EmployerDashboard() {
  const { user } = useAuth();
  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
    refetch: refetchCompany,
  } = useMyCompany(user?.id);
  const {
    data: myJobs,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch: refetchJobs,
  } = useMyJobs(company?.id);

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
  if (jobsError)
    return (
      <ErrorState
        message="Failed to load your jobs."
        onRetry={() => refetchJobs()}
      />
    );

  /* ── No company yet ── */
  if (!company) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-[var(--card-border)] p-10 text-center shadow-2xl shadow-primary/5"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-[#f04c24]/5 border border-primary/10 text-primary">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Employer Dashboard
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Welcome to HireFlow
          </h1>
          <p className="mt-3 text-sm font-light leading-relaxed text-foreground/60">
            Set up your company profile first so you can post premium jobs and start reviewing exceptional talent.
          </p>
          <Link
            href="/employer/company"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl"
          >
            Create Company Profile
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  const totalJobs = myJobs?.data.length ?? 0;
  const publishedCount = myJobs?.data.filter((j) => j.status === "PUBLISHED").length ?? 0;
  const draftCount = myJobs?.data.filter((j) => j.status === "DRAFT").length ?? 0;

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
      valueColor: "text-foreground",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      valueColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      ),
      valueColor: "text-foreground/50",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Employer Dashboard
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {company.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-foreground/60">
            {company.location && <span>{company.location}</span>}
            <span
              className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                STATUS_COLORS[company.status] ?? "bg-foreground/5 text-foreground/60 border-foreground/10"
              }`}
            >
              {company.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/employer/company"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
          >
            Edit Company
          </Link>
          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Job
          </Link>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-card border border-[var(--card-border)] p-6 shadow-sm"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-[#f04c24]/5 border border-primary/10 text-primary">
              {stat.icon}
            </div>
            <p className={`text-3xl font-extrabold ${stat.valueColor}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground/60">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Recent jobs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent Jobs</h2>
          <Link
            href="/employer/jobs"
            className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Manage all
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {jobsLoading ? (
          <Loading />
        ) : myJobs && myJobs.data.length > 0 ? (
          <div className="flex flex-col gap-3">
            {myJobs.data.slice(0, 5).map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
              >
                <Link href={`/employer/jobs/${job.id}`} className="block">
                  <div className="group rounded-2xl bg-card border border-[var(--card-border)] p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-sm font-bold text-primary">
                        {job.title[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-foreground transition-colors group-hover:text-primary">
                          {job.title}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-foreground/50">
                          {job.location} · Created {formatDate(job.createdAt)}
                        </p>
                      </div>
                      <JobStatusChip status={job.status}>
                        {JOB_STATUS_LABEL[job.status]}
                      </JobStatusChip>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs yet"
            description="Post your first premium job to start receiving applications from exceptional talent."
            actionLabel="Create a Job"
            actionHref="/employer/jobs/new"
            icon={
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          />
        )}
      </motion.div>
    </div>
  );
}
