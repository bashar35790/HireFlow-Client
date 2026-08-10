import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          HireFlow
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Job & Recruitment Platform — find your next role or hire top talent.
        </p>
        <Button variant="primary">Get Started</Button>
      </main>
    </div>
  );
}