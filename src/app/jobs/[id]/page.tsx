"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Chip } from "@heroui/react";
import { useJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { JobStatusChip } from "@/components/jobs/status-chips";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { APPLICATION_STATUS_LABEL, EXPERIENCE_LEVELS_MAP, JOB_STATUS_LABEL, JOB_TYPES_MAP } from "@/lib/constants";
import { formatSalary, formatDate } from "@/lib/format";
import { useMyApplications } from "@/hooks/useApplications";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: job, isLoading, isError, refetch } = useJob(params.id);
  const { data: myApps } = useMyApplications(1, 100);

  const application = myApps?.data.find((a) => a.jobId === params.id);

  if (isLoading || (authLoading && !job)) {
    return <Loading />;
  }

  if (isError || !job) {
    return <ErrorState message="Job not found." onRetry={() => refetch()} />;
  }

  const alreadyApplied = Boolean(application);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          ← Back to jobs
        </Link>
      </div>

      <Card variant="secondary">
        <Card.Header className="gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {job.company?.name?.[0] ?? "J"}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{job.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href={`/companies/${job.companyId}`}
                className="font-medium text-zinc-700 hover:underline dark:text-zinc-200"
              >
                {job.company?.name ?? "Unknown company"}
              </Link>
              <span>·</span>
              <span>{job.location}</span>
              <span>·</span>
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <JobStatusChip status={job.status}>
            {JOB_STATUS_LABEL[job.status]}
          </JobStatusChip>
        </Card.Header>

        <Card.Content className="gap-5">
          <div className="flex flex-wrap gap-2">
            <Chip size="sm" variant="soft">{job.category?.name ?? "General"}</Chip>
            <Chip size="sm" variant="soft">{JOB_TYPES_MAP[job.jobType] ?? job.jobType}</Chip>
            {job.experienceLevel && (
              <Chip size="sm" variant="soft">
                {EXPERIENCE_LEVELS_MAP[job.experienceLevel]}
              </Chip>
            )}
            <Chip size="sm" color="success" variant="soft">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </Chip>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Description
            </h2>
            <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
              {job.description}
            </p>
          </div>
        </Card.Content>

        <Card.Footer className="gap-3">
          <SaveJobButton jobId={job.id} />
          {alreadyApplied ? (
            <div className="flex flex-col gap-1">
              <Button variant="secondary" isDisabled>
                Applied
              </Button>
              <span className="text-xs text-zinc-500">
                Status: {APPLICATION_STATUS_LABEL[application!.status]}
              </span>
            </div>
          ) : user?.role === "EMPLOYER" || user?.role === "ADMIN" ? (
            <Button variant="secondary" isDisabled>
              Only job seekers can apply
            </Button>
          ) : user ? (
            <Link href={`/jobs/${job.id}/apply`}>
              <Button variant="primary" size="lg">
                Apply now
              </Button>
            </Link>
          ) : (
            <Link href={`/login?next=/jobs/${job.id}`}>
              <Button variant="primary" size="lg">
                Login to apply
              </Button>
            </Link>
          )}
        </Card.Footer>
      </Card>

      {job.company && (
        <Card variant="secondary" className="mt-6">
          <Card.Header>
            <Card.Title className="text-lg">About {job.company.name}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-2">
            <p className="text-zinc-600 dark:text-zinc-300">
              {job.company.description || "No description provided."}
            </p>
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
              >
                Visit website
              </a>
            )}
          </Card.Content>
        </Card>
      )}
    </div>
  );
}