"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label, ListBox, Select } from "@heroui/react";
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
        <aside className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or keyword"
              aria-label="Search jobs"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Select
              className="w-full"
              placeholder="All categories"
              aria-label="Category"
              value={category || null}
              onChange={(value) => setCategory(value ? String(value) : "")}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories?.data.map((c) => (
                    <ListBox.Item key={c.id} id={c.slug} textValue={c.name}>
                      {c.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Dhaka)"
              aria-label="Location"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Select
              className="w-full"
              placeholder="All job types"
              aria-label="Job type"
              value={jobType || null}
              onChange={(value) => setJobType(value ? String(value) : "")}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {JOB_TYPES.map((t) => (
                    <ListBox.Item
                      key={t.value}
                      id={t.value}
                      textValue={t.label}
                    >
                      {t.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-foreground/60">
              Salary range (USD)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Min"
                aria-label="Minimum salary"
              />
              <Input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Max"
                aria-label="Maximum salary"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" fullWidth onPress={clearFilters}>
              Clear filters
            </Button>
          )}
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
                  <JobCard key={job.id} job={job} />
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
