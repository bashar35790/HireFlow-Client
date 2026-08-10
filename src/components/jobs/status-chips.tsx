import { Chip } from "@heroui/react";
import type { ApplicationStatus, JobStatus } from "@/lib/types";
import {
  applicationStatusChipColor,
  APPLICATION_STATUS_LABEL,
  jobStatusChipColor,
} from "@/lib/constants";

export function JobStatusChip({ status, children }: { status: JobStatus; children?: React.ReactNode }) {
  return (
    <Chip size="sm" variant="soft" color={jobStatusChipColor[status]}>
      {children ?? status}
    </Chip>
  );
}

export function ApplicationStatusChip({ status }: { status: ApplicationStatus }) {
  return (
    <Chip size="sm" variant="soft" color={applicationStatusChipColor[status]}>
      {APPLICATION_STATUS_LABEL[status]}
    </Chip>
  );
}