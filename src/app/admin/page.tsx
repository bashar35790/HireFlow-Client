"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { RouteGuard } from "@/components/shared/route-guard";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { useCompanies, useUpdateCompany, useDeleteCompany } from "@/hooks/useCompanies";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import { useAllApplications, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { Loading } from "@/components/shared/loading";
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

type Tab = "overview" | "users" | "companies" | "jobs" | "applications" | "reviews";

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
      <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Admin Dashboard</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Manage users, companies, jobs, applications and reviews
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
  const { data: users } = useUsers(1, 1);
  const { data: companies } = useCompanies({ limit: 1 });
  const { data: jobs } = useMyJobs();
  const { data: apps } = useAllApplications({ limit: 1 });
  const { data: reviews } = useReviews();

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
          className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.label}</p>
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

function DataTable<T>({ columns, data, empty }: { columns: Column<T>[]; data: T[] | undefined; empty: string }) {
  if (!data || data.length === 0) {
    return <p className="rounded-xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
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
  const { data, isLoading, refetch } = useUsers(1, 50);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  if (isLoading) return <Loading />;

  const columns: Column<User>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium text-zinc-900 dark:text-zinc-50">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => <span className="text-zinc-600 dark:text-zinc-300">{u.email}</span> },
    { key: "role", header: "Role", render: (u) => <Chip size="sm" variant="soft">{u.role}</Chip> },
    { key: "status", header: "Status", render: (u) => <Chip size="sm" variant="soft" color={userStatusChipColor[u.status]}>{u.status}</Chip> },
    { key: "statusCtrl", header: "Set status", render: (u) => (
      <span className="flex gap-1">
        {(["ACTIVE", "INACTIVE", "BLOCKED"] as UserStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => updateUser.mutate({ id: u.id, payload: { status: s } })}
            className={`rounded px-2 py-1 text-xs ${u.status === s ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {s}
          </button>
        ))}
      </span>
    )},
    { key: "delete", header: "", render: (u) => (
      <button
        onClick={() => { if (window.confirm(`Delete user ${u.name}?`)) deleteUser.mutate(u.id); }}
        className="text-xs text-red-600 hover:underline"
      >
        Delete
      </button>
    )},
  ];

  return (
    <div className="space-y-3">
      <button onClick={() => refetch()} className="text-xs text-zinc-500 hover:underline">Refresh</button>
      <DataTable columns={columns} data={data?.data} empty="No users found." />
    </div>
  );
}

function CompaniesTab() {
  const { data, isLoading } = useCompanies({ limit: 100 });
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  if (isLoading) return <Loading />;

  const columns: Column<Company>[] = [
    { key: "name", header: "Name", render: (c) => <span className="font-medium text-zinc-900 dark:text-zinc-50">{c.name}</span> },
    { key: "location", header: "Location", render: (c) => <span className="text-zinc-600 dark:text-zinc-300">{c.location}</span> },
    { key: "status", header: "Status", render: (c) => <Chip size="sm" variant="soft" color={companyStatusChipColor[c.status]}>{c.status}</Chip> },
    { key: "statusCtrl", header: "Approve / reject", render: (c) => (
      <span className="flex gap-1">
        {(["APPROVED", "REJECTED", "PENDING"] as CompanyStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => updateCompany.mutate({ id: c.id, payload: { status: s } })}
            className={`rounded px-2 py-1 text-xs ${c.status === s ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {s}
          </button>
        ))}
      </span>
    )},
    { key: "delete", header: "", render: (c) => (
      <button
        onClick={() => { if (window.confirm(`Delete company ${c.name}?`)) deleteCompany.mutate(c.id); }}
        className="text-xs text-red-600 hover:underline"
      >
        Delete
      </button>
    )},
  ];

  return <DataTable columns={columns} data={data?.data} empty="No companies found." />;
}

function JobsTab() {
  const { data, isLoading } = useMyJobs();
  const deleteJob = useDeleteJob();

  if (isLoading) return <Loading />;

  const columns: Column<Job>[] = [
    { key: "title", header: "Title", render: (j) => (
      <Link href={`/jobs/${j.id}`} className="font-medium text-zinc-900 underline dark:text-zinc-50">{j.title}</Link>
    )},
    { key: "company", header: "Company", render: (j) => <span className="text-zinc-600 dark:text-zinc-300">{j.company?.name}</span> },
    { key: "status", header: "Status", render: (j) => <Chip size="sm" variant="soft">{j.status}</Chip> },
    { key: "created", header: "Created", render: (j) => <span className="text-zinc-600 dark:text-zinc-300">{formatDate(j.createdAt)}</span> },
    { key: "delete", header: "", render: (j) => (
      <button
        onClick={() => { if (window.confirm(`Delete job ${j.title}?`)) deleteJob.mutate(j.id); }}
        className="text-xs text-red-600 hover:underline"
      >
        Delete
      </button>
    )},
  ];

  return <DataTable columns={columns} data={data?.data} empty="No jobs found." />;
}

function ApplicationsTab() {
  const { data, isLoading } = useAllApplications({ limit: 100 });
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) return <Loading />;

  const columns: Column<Application>[] = [
    { key: "job", header: "Job", render: (a) => <span className="font-medium text-zinc-900 dark:text-zinc-50">{a.job?.title}</span> },
    { key: "applicant", header: "Applicant", render: (a) => <span>{a.user?.name} <span className="text-zinc-500">({a.user?.email})</span></span> },
    { key: "status", header: "Status", render: (a) => <Chip size="sm" variant="soft">{APPLICATION_STATUS_LABEL[a.status]}</Chip> },
    { key: "statusCtrl", header: "Set status", render: (a) => (
      <select
        value={a.status}
        onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value as ApplicationStatus })}
        className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
      >
        {Object.entries(APPLICATION_STATUS_LABEL).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    )},
  ];

  return <DataTable columns={columns} data={data?.data} empty="No applications found." />;
}

function ReviewsTab() {
  const { data, isLoading } = useReviews();
  const deleteReview = useDeleteReview();

  if (isLoading) return <Loading />;

  const columns: Column<Review>[] = [
    { key: "company", header: "Company", render: (r) => <span className="font-medium text-zinc-900 dark:text-zinc-50">{r.companyId}</span> },
    { key: "user", header: "User", render: (r) => <span className="text-zinc-600 dark:text-zinc-300">{r.user?.name}</span> },
    { key: "rating", header: "Rating", render: (r) => <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span> },
    { key: "comment", header: "Comment", render: (r) => <span className="line-clamp-1 max-w-[240px] text-zinc-600 dark:text-zinc-300">{r.comment}</span> },
    { key: "delete", header: "", render: (r) => (
      <button onClick={() => { if (window.confirm("Delete this review?")) deleteReview.mutate(r.id); }} className="text-xs text-red-600 hover:underline">
        Delete
      </button>
    )},
  ];

  return <DataTable columns={columns} data={data?.data} empty="No reviews found." />;
}