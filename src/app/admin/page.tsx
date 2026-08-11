"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { RouteGuard } from "@/components/shared/route-guard";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import {
  useCompanies,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/useCompanies";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import {
  useAllApplications,
  useUpdateApplicationStatus,
} from "@/hooks/useApplications";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import {
  APPLICATION_STATUS_LABEL,
  companyStatusChipColor,
  userStatusChipColor,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type {
  Application,
  ApplicationStatus,
  Company,
  CompanyStatus,
  Job,
  Review,
  User,
  UserStatus,
} from "@/lib/types";

type Tab =
  "overview" | "users" | "companies" | "jobs" | "applications" | "reviews";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "companies", label: "Companies" },
  { id: "jobs", label: "Jobs" },
  { id: "applications", label: "Applications" },
  { id: "reviews", label: "Reviews" },
];

export default function AdminPage() {
  return (
    <RouteGuard roles={["ADMIN"]}>
      <AdminDashboard />
    </RouteGuard>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-foreground">
        Admin Dashboard
      </h1>
      <p className="mb-8 text-foreground/60">
        Manage users, companies, jobs, applications and reviews
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-foreground text-white"
                : "border border-foreground/30 text-foreground/70 hover:bg-foreground/10 dark:hover:bg-foreground/90"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "users" && <UsersTab />}
      {tab === "companies" && <CompaniesTab />}
      {tab === "jobs" && <JobsTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  );
}

function Overview() {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers(1, 1);
  const {
    data: companies,
    isLoading: companiesLoading,
    isError: companiesError,
  } = useCompanies({ limit: 1 });
  const {
    data: jobs,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useMyJobs();
  const {
    data: apps,
    isLoading: appsLoading,
    isError: appsError,
  } = useAllApplications({ limit: 1 });
  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useReviews();

  if (
    usersLoading ||
    companiesLoading ||
    jobsLoading ||
    appsLoading ||
    reviewsLoading
  ) {
    return <Loading />;
  }
  if (usersError || companiesError || jobsError || appsError || reviewsError) {
    return <ErrorState message="Failed to load dashboard stats." />;
  }

  const stats = [
    { label: "Users", value: users?.meta.total ?? "—" },
    { label: "Companies", value: companies?.meta.total ?? "—" },
    { label: "Jobs", value: jobs?.data.length ?? "—" },
    { label: "Applications", value: apps?.meta.total ?? "—" },
    { label: "Reviews", value: reviews?.meta.total ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-[var(--card-border)] bg-card p-6 text-center shadow-sm"
        >
          <p className="text-3xl font-bold text-foreground">{s.value}</p>
          <p className="mt-1 text-sm text-foreground/60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

function DataTable<T>({
  columns,
  data,
  empty,
}: {
  columns: Column<T>[];
  data: T[] | undefined;
  empty: string;
}) {
  if (!data || data.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-foreground/30 py-10 text-center text-sm text-foreground/60">
        {empty}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-foreground/20">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/60">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/20">
          {data.map((row, i) => (
            <tr
              key={i}
              className="table-row-base"
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab() {
  const { data, isLoading, isError, refetch } = useUsers(1, 50);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState message="Failed to load users." onRetry={() => refetch()} />
    );

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <span className="font-medium text-foreground">{u.name}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (u) => <span className="text-foreground/70">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <Chip size="sm" variant="soft">
          {u.role}
        </Chip>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Chip size="sm" variant="soft" color={userStatusChipColor[u.status]}>
          {u.status}
        </Chip>
      ),
    },
    {
      key: "statusCtrl",
      header: "Set status",
      render: (u) => (
        <span className="flex gap-1">
          {(["ACTIVE", "INACTIVE", "BLOCKED"] as UserStatus[]).map((s) => (
            <button
              key={s}
              onClick={() =>
                updateUser.mutate({ id: u.id, payload: { status: s } })
              }
              className={`rounded px-2 py-1 text-xs ${u.status === s ? "bg-foreground text-white" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"}`}
            >
              {s}
            </button>
          ))}
        </span>
      ),
    },
    {
      key: "delete",
      header: "",
      render: (u) => (
        <button
          onClick={() => {
            if (window.confirm(`Delete user ${u.name}?`))
              deleteUser.mutate(u.id);
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => refetch()}
        className="text-xs text-foreground/60 hover:underline"
      >
        Refresh
      </button>
      <DataTable columns={columns} data={data?.data} empty="No users found." />
    </div>
  );
}

function CompaniesTab() {
  const { data, isLoading, isError, refetch } = useCompanies({ limit: 100 });
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState
        message="Failed to load companies."
        onRetry={() => refetch()}
      />
    );

  const columns: Column<Company>[] = [
    {
      key: "name",
      header: "Name",
      render: (c) => (
        <span className="font-medium text-foreground">{c.name}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (c) => <span className="text-foreground/70">{c.location}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Chip size="sm" variant="soft" color={companyStatusChipColor[c.status]}>
          {c.status}
        </Chip>
      ),
    },
    {
      key: "statusCtrl",
      header: "Approve / reject",
      render: (c) => (
        <span className="flex gap-1">
          {(["APPROVED", "REJECTED", "PENDING"] as CompanyStatus[]).map((s) => (
            <button
              key={s}
              onClick={() =>
                updateCompany.mutate({ id: c.id, payload: { status: s } })
              }
              className={`rounded px-2 py-1 text-xs ${c.status === s ? "bg-foreground text-white" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"}`}
            >
              {s}
            </button>
          ))}
        </span>
      ),
    },
    {
      key: "delete",
      header: "",
      render: (c) => (
        <button
          onClick={() => {
            if (window.confirm(`Delete company ${c.name}?`))
              deleteCompany.mutate(c.id);
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.data}
      empty="No companies found."
    />
  );
}

function JobsTab() {
  const { data, isLoading, isError, refetch } = useMyJobs();
  const deleteJob = useDeleteJob();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState message="Failed to load jobs." onRetry={() => refetch()} />
    );

  const columns: Column<Job>[] = [
    {
      key: "title",
      header: "Title",
      render: (j) => (
        <Link
          href={`/jobs/${j.id}`}
          className="font-medium text-foreground underline"
        >
          {j.title}
        </Link>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (j) => (
        <span className="text-foreground/70">{j.company?.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (j) => (
        <Chip size="sm" variant="soft">
          {j.status}
        </Chip>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (j) => (
        <span className="text-foreground/70">{formatDate(j.createdAt)}</span>
      ),
    },
    {
      key: "delete",
      header: "",
      render: (j) => (
        <button
          onClick={() => {
            if (window.confirm(`Delete job ${j.title}?`))
              deleteJob.mutate(j.id);
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={data?.data} empty="No jobs found." />
  );
}

function ApplicationsTab() {
  const { data, isLoading, isError, refetch } = useAllApplications({
    limit: 100,
  });
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState
        message="Failed to load applications."
        onRetry={() => refetch()}
      />
    );

  const columns: Column<Application>[] = [
    {
      key: "job",
      header: "Job",
      render: (a) => (
        <span className="font-medium text-foreground">{a.job?.title}</span>
      ),
    },
    {
      key: "applicant",
      header: "Applicant",
      render: (a) => (
        <span>
          {a.user?.name}{" "}
          <span className="text-foreground/60">({a.user?.email})</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <Chip size="sm" variant="soft">
          {APPLICATION_STATUS_LABEL[a.status]}
        </Chip>
      ),
    },
    {
      key: "statusCtrl",
      header: "Set status",
      render: (a) => (
        <select
          value={a.status}
          onChange={(e) =>
            updateStatus.mutate({
              id: a.id,
              status: e.target.value as ApplicationStatus,
            })
          }
          className="rounded-lg border border-[var(--card-border)] bg-card px-2 py-1 text-xs text-foreground"
        >
          {Object.entries(APPLICATION_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.data}
      empty="No applications found."
    />
  );
}

function ReviewsTab() {
  const { data, isLoading, isError, refetch } = useReviews();
  const deleteReview = useDeleteReview();

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorState message="Failed to load reviews." onRetry={() => refetch()} />
    );

  const columns: Column<Review>[] = [
    {
      key: "company",
      header: "Company",
      render: (r) => (
        <span className="font-medium text-foreground">{r.companyId}</span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (r) => <span className="text-foreground/70">{r.user?.name}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      render: (r) => (
        <span className="text-amber-500">
          {"★".repeat(r.rating)}
          {"☆".repeat(5 - r.rating)}
        </span>
      ),
    },
    {
      key: "comment",
      header: "Comment",
      render: (r) => (
        <span className="line-clamp-1 max-w-[240px] text-foreground/70">
          {r.comment}
        </span>
      ),
    },
    {
      key: "delete",
      header: "",
      render: (r) => (
        <button
          onClick={() => {
            if (window.confirm("Delete this review?"))
              deleteReview.mutate(r.id);
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={data?.data} empty="No reviews found." />
  );
}
