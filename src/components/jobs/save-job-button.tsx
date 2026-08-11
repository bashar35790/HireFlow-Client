"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSaveJob, useUnsaveJob, useSavedJobIds } from "@/hooks/useSavedJobs";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { user } = useAuth();
  const save = useSaveJob();
  const unsave = useUnsaveJob();
  const { data: savedIds, isLoading: idsLoading } = useSavedJobIds();

  if (!user) {
    return (
      <Link
        href={`/login?next=/jobs/${jobId}`}
        className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-transparent px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Save Job
      </Link>
    );
  }

  const isSaved = savedIds?.has(jobId) ?? false;
  const pending = save.isPending || unsave.isPending || idsLoading;

  function toggle() {
    if (isSaved) {
      unsave.mutate(jobId);
    } else {
      save.mutate(jobId);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-pressed={isSaved}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
        isSaved
          ? "bg-gradient-to-r from-red-500 to-[#f04c24] text-white shadow-lg shadow-red-500/30 hover:scale-105 hover:shadow-xl"
          : "border border-foreground/20 bg-transparent text-foreground hover:border-primary hover:text-primary hover:shadow-md"
      }`}
    >
      <svg
        className="h-4 w-4 transition-transform"
        fill={isSaved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {isSaved ? "Saved" : "Save Job"}
    </button>
  );
}
