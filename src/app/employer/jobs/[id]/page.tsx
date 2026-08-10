"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Label, ListBox, Select } from "@heroui/react";
import { RouteGuard } from "@/components/shared/route-guard";
import { useJob } from "@/hooks/useJobs";
import { useAllApplications, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { ApplicationStatusChip } from "@/components/jobs/status-chips";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABEL } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types";
import { useState } from "react";

export default function EmployerJobDetailPage() {
  return (
    <RouteGuard roles={["EMPLOYER", "ADMIN"]}>
      <JobDetail />
    </RouteGuard>
  );
}

function JobDetail() {
  const params = useParams<{ id: string }>();
  const { data: job, isLoading, isError, refetch } = useJob(params.id);
  const { data: apps, isLoading: appsLoading } = useAllApplications({ jobId: params.id, limit: 100 });
  const updateStatus = useUpdateApplicationStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (isError || !job) return <ErrorState message="Job not found." onRetry={() => refetch()} />;

  async function onStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      await updateStatus.mutateAsync({ id, status });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/employer/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          ← Back to my jobs
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{job.title}</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {job.company?.name} · {job.location}
          </p>
        </div>
        <Link href={`/employer/jobs/${job.id}/edit`}>
          <Button variant="outline">Edit job</Button>
        </Link>
      </div>

      <Card variant="secondary" className="mb-6">
        <Card.Content className="gap-2">
          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
            <span className="font-medium">Applicants: {apps?.data.length ?? 0}</span>
            <span>Status: {job.status}</span>
          </div>
        </Card.Content>
      </Card>

      <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Applications</h2>

      {appsLoading ? (
        <Loading />
      ) : apps && apps.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {apps.data.map((application) => (
            <Card key={application.id} variant="secondary">
              <Card.Header className="flex-wrap gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {application.user?.name?.[0] ?? "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {application.user?.name ?? "Applicant"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {application.user?.email} · Applied {formatDateTime(application.createdAt)}
                  </p>
                </div>
                <ApplicationStatusChip status={application.status} />
              </Card.Header>
              {(application.resume || application.coverLetter) && (
                <Card.Content className="gap-2">
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
                    >
                      Resume
                    </a>
                  )}
                  {application.coverLetter && (
                    <p className="whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-300">
                      {application.coverLetter}
                    </p>
                  )}
                </Card.Content>
              )}
              <Card.Footer className="gap-2">
                <Label className="text-sm">Update status</Label>
                <Select
                  className="w-full sm:max-w-[220px]"
                  value={application.status}
                  isDisabled={updatingId === application.id}
                  onChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {APPLICATION_STATUSES.map((s) => (
                        <ListBox.Item key={s} id={s} textValue={APPLICATION_STATUS_LABEL[s]}>
                          {APPLICATION_STATUS_LABEL[s]}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Share this job to start receiving applications."
          actionLabel="View job page"
          actionHref={`/jobs/${job.id}`}
        />
      )}
    </div>
  );
}