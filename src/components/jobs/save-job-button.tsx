"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { useSaveJob, useUnsaveJob, useSavedJobIds } from "@/hooks/useSavedJobs";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { user } = useAuth();
  const save = useSaveJob();
  const unsave = useUnsaveJob();
  const { data: savedIds, isLoading: idsLoading } = useSavedJobIds();

  if (!user) {
    return (
      <Link href={`/login?next=/jobs/${jobId}`}>
        <Button variant="outline">Save job</Button>
      </Link>
    );
  }

  const isSaved = savedIds?.has(jobId) ?? false;
  const pending = save.isPending || unsave.isPending;

  function toggle() {
    if (isSaved) {
      unsave.mutate(jobId);
    } else {
      save.mutate(jobId);
    }
  }

  return (
    <Button
      variant={isSaved ? "ghost" : "outline"}
      isDisabled={pending || idsLoading}
      onPress={toggle}
      aria-pressed={isSaved}
    >
      {isSaved ? "♥ Saved" : "♡ Save"}
    </Button>
  );
}