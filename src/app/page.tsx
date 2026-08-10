"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobs/job-card";
import { Loading } from "@/components/shared/loading";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useJobs({ limit: 6 });

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    router.push(`/jobs${params}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-zinc-50 py-16 dark:bg-black sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Find the job that fits your life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Explore thousands of job opportunities from companies that care. Upload your profile and
            get hired faster with HireFlow.
          </p>

          <form
            onSubmit={submitSearch}
            className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, keyword…"
              aria-label="Search jobs"
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>

          {!user && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="lg">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Latest Jobs</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Fresh openings posted by employers
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            View all jobs
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-center text-zinc-500">
            Could not load jobs. Is the API server running?
          </p>
        ) : data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500 dark:border-zinc-700">
            No jobs posted yet. Check back soon!
          </div>
        )}
      </section>
    </div>
  );
}