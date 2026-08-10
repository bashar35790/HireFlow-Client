import { Spinner } from "@heroui/react";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-500">
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  );
}