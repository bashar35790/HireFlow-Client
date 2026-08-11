import { Spinner } from "@heroui/react";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-foreground/60">
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
