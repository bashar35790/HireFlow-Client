import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import type { Job } from "@/lib/types";
import { JOB_TYPES_MAP } from "@/lib/constants";
import { formatSalary, timeAgo } from "@/lib/format";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <Card
        className="h-full border-none bg-transparent shadow-none transition-all"
        variant="secondary"
      >
        <Card.Header className="gap-4 pb-2">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-xl font-bold text-primary shadow-inner border border-primary/10">
            {job.company?.name?.[0] ?? "J"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              {job.title}
            </h3>
            <p className="truncate text-sm font-medium text-foreground/60">
              {job.company?.name ?? "Exclusive Partner"}
            </p>
          </div>
          <p className="whitespace-nowrap text-xs font-light text-foreground/40">
            {timeAgo(job.createdAt)}
          </p>
        </Card.Header>
        <Card.Content className="gap-4 pt-2">
          <p className="line-clamp-2 text-sm font-light leading-relaxed text-foreground/70">
            {job.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
            <Chip
              size="sm"
              variant="soft"
              className="bg-foreground/5 text-foreground/70"
            >
              {job.category?.name ?? "Premium Role"}
            </Chip>
            <Chip
              size="sm"
              variant="soft"
              className="bg-foreground/5 text-foreground/70"
            >
              {job.location}
            </Chip>
            <Chip
              size="sm"
              variant="soft"
              className="bg-primary/10 text-primary border border-primary/20"
            >
              {JOB_TYPES_MAP[job.jobType] ?? job.jobType}
            </Chip>
            {job.salaryMin != null && (
              <Chip
                size="sm"
                variant="soft"
                className="bg-[#f04c24]/10 text-[#f04c24] border border-[#f04c24]/20 font-medium"
              >
                {formatSalary(job.salaryMin, job.salaryMax)}
              </Chip>
            )}
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
