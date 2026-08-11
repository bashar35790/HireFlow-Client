"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobs } from "@/hooks/useJobs";
import { useCategories } from "@/hooks/useCategories";
import { JOB_TYPES } from "@/lib/constants";
import { JobCard } from "@/components/jobs/job-card";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";

export default function JobsPage() {
  return (
    <Suspense fallback={<Loading label="Loading jobs…" />}>
      <JobsContent />
    </Suspense>
  );
}

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") ?? "");
  const [salaryMin, setSalaryMin] = useState(
    searchParams.get("salaryMin") ?? "",
  );
  const [salaryMax, setSalaryMax] = useState(
    searchParams.get("salaryMax") ?? "",
  );
  const page = Number(searchParams.get("page")) || 1;

  const { data: categories } = useCategories();

  const buildParams = useCallback(
    (nextPage: number, overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      const set = (key: string, value: string) => {
        if (value) params.set(key, value);
      };
      set("search", overrides.search ?? search);
      set("category", overrides.category ?? category);
      set("location", overrides.location ?? location);
      set("jobType", overrides.jobType ?? jobType);
      set("salaryMin", overrides.salaryMin ?? salaryMin);
      set("salaryMax", overrides.salaryMax ?? salaryMax);
      params.set("limit", "10");
      if (nextPage > 1) params.set("page", String(nextPage));
      return params.toString();
    },
    [search, category, location, jobType, salaryMin, salaryMax],
  );

  const pushParams = useCallback(
    (nextPage: number, overrides: Record<string, string> = {}) => {
      const qs = buildParams(nextPage, overrides);
      router.replace(`/jobs${qs ? `?${qs}` : ""}`);
    },
    [buildParams, router],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      pushParams(1);
    }, 600);
    return () => window.clearTimeout(id);
  }, [search, location, salaryMin, salaryMax, pushParams]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setJobType("");
    setSalaryMin("");
    setSalaryMax("");
    router.replace("/jobs");
  }

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      location: searchParams.get("location") || undefined,
      jobType: searchParams.get("jobType") || undefined,
      salaryMin: searchParams.get("salaryMin")
        ? Number(searchParams.get("salaryMin"))
        : undefined,
      salaryMax: searchParams.get("salaryMax")
        ? Number(searchParams.get("salaryMax"))
        : undefined,
      page,
      limit: 10,
    }),
    [searchParams, page],
  );

  const { data, isLoading, isError, refetch } = useJobs(filters);
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(category) ||
    Boolean(location) ||
    Boolean(jobType) ||
    Boolean(salaryMin) ||
    Boolean(salaryMax);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Browse Jobs</h1>
        <p className="mt-1 text-foreground/60">
          Search and filter jobs to find your next opportunity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* ── Filter Sidebar ── */}
        <aside>
          <div className="sticky top-[88px] rounded-2xl bg-card border border-[var(--card-border)] shadow-sm overflow-hidden">
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* Search */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Keyword
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                    </svg>
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title or keyword"
                    aria-label="Search jobs"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCategory(v);
                      pushParams(1, { category: v });
                    }}
                    aria-label="Category"
                    className="w-full appearance-none rounded-xl border border-[var(--card-border)] bg-background py-2.5 pl-3 pr-8 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All categories</option>
                    {categories?.data.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Remote"
                  aria-label="Location"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Job Type
                </label>
                <div className="relative">
                  <select
                    value={jobType}
                    onChange={(e) => {
                      const v = e.target.value;
                      setJobType(v);
                      pushParams(1, { jobType: v });
                    }}
                    aria-label="Job type"
                    className="w-full appearance-none rounded-xl border border-[var(--card-border)] bg-background py-2.5 pl-3 pr-8 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All job types</option>
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Salary Range */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Salary (USD)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    aria-label="Minimum salary"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    aria-label="Maximum salary"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <ErrorState
              message="Could not load jobs."
              onRetry={() => refetch()}
            />
          ) : data && data.data.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-foreground/60">
                {data.meta.total} job{data.meta.total === 1 ? "" : "s"} found
              </p>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {data.data.map((job) => (
                  <div
                    key={job.id}
                    className="group h-full rounded-3xl bg-card p-2 transition-all hover:shadow-2xl hover:shadow-primary/10 dark:bg-card"
                  >
                    <div className="h-full rounded-2xl bg-background border border-[var(--card-border)] p-6 transition-colors group-hover:border-primary/20">
                      <JobCard job={job} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={(next) => pushParams(next)}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No jobs match your filters"
              description="Try adjusting your search or clearing some filters."
              actionLabel="Clear filters"
              actionHref="/jobs"
            />
          )}
        </section>
      </div>
    </div>
  );
}
