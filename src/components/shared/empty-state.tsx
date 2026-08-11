import { Button } from "@heroui/react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/30 bg-foreground/5/50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-foreground/90">{title}</p>
      {description && (
        <p className="max-w-md text-sm text-foreground/60">{description}</p>
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
