"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import { Loading } from "@/components/shared/loading";
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
  const { data: company, isLoading: companyLoading } = useMyCompany(user?.id);
  const { data: myJobs, isLoading } = useMyJobs(company?.id);
  const deleteJob = useDeleteJob();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (companyLoading) return <Loading />;

  if (!company) {
    return (
      <EmptyState
        title="You need a company first"
        description="Create your company profile before posting jobs."
        actionLabel="Create company"
        actionHref="/employer/company"
      />
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
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">My Jobs</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Create, update and manage your job postings
          </p>
        </div>
        <Link href="/employer/jobs/new">
          <Button variant="primary">New job</Button>
        </Link>
      </div>

      {isLoading ? (
        <Loading />
      ) : myJobs && myJobs.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {myJobs.data.map((job) => (
            <Card key={job.id} variant="secondary">
              <Card.Header className="gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                    {job.title}
                  </h2>
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {JOB_TYPES_MAP[job.jobType]} · {job.location} ·{" "}
                    {formatSalary(job.salaryMin, job.salaryMax)} · {formatDate(job.createdAt)}
                  </p>
                </div>
                <JobStatusChip status={job.status}>{JOB_STATUS_LABEL[job.status]}</JobStatusChip>
              </Card.Header>
              <Card.Footer className="gap-2">
                <Link href={`/employer/jobs/${job.id}`}>
                  <button className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                    View & applicants
                  </button>
                </Link>
                <Link href={`/employer/jobs/${job.id}/edit`}>
                  <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  {deletingId === job.id ? "Deleting…" : "Delete"}
                </button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs yet"
          description="Create your first job posting."
          actionLabel="Create a job"
          actionHref="/employer/jobs/new"
        />
      )}
    </div>
  );
}