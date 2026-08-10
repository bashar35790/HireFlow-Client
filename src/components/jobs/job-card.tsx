import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import type { Job } from "@/lib/types";
import { JOB_TYPES_MAP } from "@/lib/constants";
import { formatSalary, timeAgo } from "@/lib/format";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card
        className="h-full transition hover:border-zinc-400 dark:hover:border-zinc-600"
        variant="secondary"
      >
        <Card.Header className="gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {job.company?.name?.[0] ?? "J"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
              {job.title}
            </h3>
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
              {job.company?.name ?? "Unknown company"}
            </p>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{timeAgo(job.createdAt)}</p>
        </Card.Header>
        <Card.Content className="gap-4">
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
            {job.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Chip size="sm" variant="soft">
              {job.category?.name ?? "General"}
            </Chip>
            <Chip size="sm" variant="soft">
              {job.location}
            </Chip>
            <Chip size="sm" variant="soft">
              {JOB_TYPES_MAP[job.jobType] ?? job.jobType}
            </Chip>
            {job.salaryMin != null && (
              <Chip size="sm" color="success" variant="soft">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </Chip>
            )}
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}