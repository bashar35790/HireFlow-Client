import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            HireFlow
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Find your next role or hire top talent.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Browse Jobs
          </Link>
          <Link href="/companies" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Companies
          </Link>
          <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Post a Job
          </Link>
        </nav>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          © {new Date().getFullYear()} HireFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}