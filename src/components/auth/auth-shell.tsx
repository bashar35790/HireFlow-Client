import { Card } from "@heroui/react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-foreground/5 px-4 py-12 dark:bg-black">
      <Card className="w-full max-w-md" variant="secondary">
        {children}
      </Card>
    </div>
  );
}
