import { Button } from "@heroui/react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
      <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
      {description && (
        <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" className="mt-2">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}