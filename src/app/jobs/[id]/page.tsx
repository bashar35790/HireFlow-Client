"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { JobStatusChip } from "@/components/jobs/status-chips";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import {
  APPLICATION_STATUS_LABEL,
  EXPERIENCE_LEVELS_MAP,
  JOB_STATUS_LABEL,
  JOB_TYPES_MAP,
} from "@/lib/constants";
import { formatSalary, timeAgo } from "@/lib/format";
import { useMyApplications } from "@/hooks/useApplications";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: job, isLoading, isError, refetch } = useJob(params.id);
  const isJobSeeker = user?.role === "JOB_SEEKER";
  const { data: myApps, isLoading: appsLoading } = useMyApplications(
    1,
    100,
    isJobSeeker,
  );

  const application = myApps?.data.find((a) => a.jobId === params.id);

  if (isLoading || (authLoading && !job)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mt-10">
        <ErrorState message="Job not found." onRetry={() => refetch()} />
      </div>
    );
  }

  const alreadyApplied = Boolean(application);
  const checksPending = Boolean(user) && appsLoading && !myApps;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href="/jobs"
          className="group inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Collection
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative overflow-hidden rounded-3xl"
      >
        {/* Decorative subtle background elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-3xl font-bold text-primary shadow-inner">
                {job.company?.name?.[0] ?? "J"}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-foreground/70">
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="text-foreground transition-colors hover:text-primary hover:underline"
                  >
                    {job.company?.name ?? "Exclusive Partner"}
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-foreground/30" />
                  <span>{job.location}</span>
                  <span className="h-1 w-1 rounded-full bg-foreground/30" />
                  <span>Posted {timeAgo(job.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <JobStatusChip status={job.status}>
                {JOB_STATUS_LABEL[job.status]}
              </JobStatusChip>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-foreground/5 px-4 py-1.5 text-sm font-medium text-foreground/80 border border-foreground/10">
              {job.category?.name ?? "Premium Role"}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
              {JOB_TYPES_MAP[job.jobType] ?? job.jobType}
            </span>
            {job.experienceLevel && (
              <span className="inline-flex items-center rounded-full bg-foreground/5 px-4 py-1.5 text-sm font-medium text-foreground/80 border border-foreground/10">
                {EXPERIENCE_LEVELS_MAP[job.experienceLevel]}
              </span>
            )}
            {job.salaryMin != null && (
              <span className="inline-flex items-center rounded-full bg-[#f04c24]/10 px-4 py-1.5 text-sm font-medium text-[#f04c24] border border-[#f04c24]/20">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            )}
          </div>

          <hr className="my-10 border-t border-foreground/10" />

          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-foreground mb-4">
              About the Role
            </h2>
            <div className="text-foreground/80 leading-relaxed font-light whitespace-pre-line text-lg">
              {job.description}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            {checksPending ? (
              <Button size="lg" className="rounded-full font-medium" isDisabled>
                Checking status…
              </Button>
            ) : alreadyApplied ? (
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full font-medium bg-foreground/10 text-foreground"
                  isDisabled
                >
                  Application Submitted
                </Button>
                <span className="text-sm font-medium text-foreground/60">
                  Status: {APPLICATION_STATUS_LABEL[application!.status]}
                </span>
              </div>
            ) : user?.role === "EMPLOYER" || user?.role === "ADMIN" ? (
              <Button size="lg" className="rounded-full font-medium" isDisabled>
                Job Seekers Only
              </Button>
            ) : user ? (
              <Link href={`/jobs/${job.id}/apply`}>
                <Button
                  size="lg"
                  className="rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
                >
                  Apply Now
                </Button>
              </Link>
            ) : (
              <Link href={`/login?next=/jobs/${job.id}`}>
                <Button
                  size="lg"
                  className="rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
                >
                  Sign In to Apply
                </Button>
              </Link>
            )}
            <div className="ml-auto">
              <SaveJobButton jobId={job.id} />
            </div>
          </div>
        </div>
      </motion.div>

      {job.company && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 glass rounded-3xl p-6 sm:p-10"
        >
          <h3 className="text-xl font-bold text-foreground mb-4">
            About {job.company.name}
          </h3>
          <p className="text-foreground/70 leading-relaxed font-light mb-6 text-lg max-w-3xl">
            {job.company.description ||
              "Leading the industry with premium standards."}
          </p>
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Visit Company Website
              <span className="ml-1 text-lg">↗</span>
            </a>
          )}
        </motion.div>
      )}
    </div>
  );
}
