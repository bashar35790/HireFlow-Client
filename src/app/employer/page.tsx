"use client";

import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { useMyJobs } from "@/hooks/useJobs";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { JobStatusChip } from "@/components/jobs/status-chips";
import { companyStatusChipColor, JOB_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export default function EmployerDashboardPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <EmployerDashboard />
    </RouteGuard>
  );
}

function EmployerDashboard() {
  const { user } = useAuth();
  const { data: company, isLoading: companyLoading, isError: companyError, refetch: refetchCompany } = useMyCompany(user?.id);
  const { data: myJobs, isLoading: jobsLoading, isError: jobsError, refetch: refetchJobs } = useMyJobs(company?.id);

  if (companyLoading) return <Loading />;
  if (companyError) return <ErrorState message="Failed to load your company." onRetry={() => refetchCompany()} />;
  if (jobsError) return <ErrorState message="Failed to load your jobs." onRetry={() => refetchJobs()} />;

  if (!company) {
    return (
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <Card variant="secondary">
          <Card.Content className="gap-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Welcome to your employer dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Create your company profile first so you can post jobs and review applicants.
            </p>
            <div>
              <Link href="/employer/company">
                <Button variant="primary">Create your company</Button>
              </Link>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  const publishedCount = myJobs?.data.filter((j) => j.status === "PUBLISHED").length ?? 0;
  const draftCount = myJobs?.data.filter((j) => j.status === "DRAFT").length ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {company.name}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            {company.location}
            <Chip size="sm" variant="soft" color={companyStatusChipColor[company.status]}>
              {company.status}
            </Chip>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/employer/company">
            <Button variant="outline">Edit company</Button>
          </Link>
          <Link href="/employer/jobs/new">
            <Button variant="primary">New job</Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="secondary">
          <Card.Content className="items-center gap-1 py-6 text-center">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {myJobs?.data.length ?? 0}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total jobs</p>
          </Card.Content>
        </Card>
        <Card variant="secondary">
          <Card.Content className="items-center gap-1 py-6 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{publishedCount}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Published</p>
          </Card.Content>
        </Card>
        <Card variant="secondary">
          <Card.Content className="items-center gap-1 py-6 text-center">
            <p className="text-3xl font-bold text-zinc-400">{draftCount}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Drafts</p>
          </Card.Content>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Your jobs</h2>
        <Link
          href="/employer/jobs"
          className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          Manage all
        </Link>
      </div>

      {jobsLoading ? (
        <Loading />
      ) : myJobs && myJobs.data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {myJobs.data.slice(0, 5).map((job) => (
            <Link key={job.id} href={`/employer/jobs/${job.id}`}>
              <Card className="transition hover:border-zinc-400 dark:hover:border-zinc-600" variant="secondary">
                <Card.Header className="gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                      {job.title}
                    </h3>
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {job.location} · Created {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <JobStatusChip status={job.status}>{JOB_STATUS_LABEL[job.status]}</JobStatusChip>
                </Card.Header>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs yet"
          description="Post your first job to start receiving applications."
          actionLabel="Create a job"
          actionHref="/employer/jobs/new"
        />
      )}
    </div>
  );
}