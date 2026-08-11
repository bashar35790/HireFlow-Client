"use client";

import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { useCompanies } from "@/hooks/useCompanies";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { companyStatusChipColor } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export default function CompaniesPage() {
  const { isEmployer, isAdmin } = useAuth();
  const { data, isLoading, isError, refetch } = useCompanies({
    status: "APPROVED",
    limit: 100,
  });

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <p className="mt-1 text-foreground/60">
            Discover companies hiring on HireFlow
          </p>
        </div>
        {(isEmployer || isAdmin) && (
          <Link href="/employer/company">
            <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition hover:bg-foreground/80 dark:hover:bg-foreground/30">
              Register your company
            </button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState
          message="Could not load companies."
          onRetry={() => refetch()}
        />
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card
                className="h-full transition hover:border-foreground/50 dark:hover:border-foreground/70"
                variant="secondary"
              >
                <Card.Header className="gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground/10 text-lg font-bold text-foreground/70">
                    {company.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-foreground">
                      {company.name}
                    </h2>
                    <p className="truncate text-sm text-foreground/60">
                      {company.location}
                    </p>
                  </div>
                </Card.Header>
                <Card.Content className="gap-3">
                  <p className="line-clamp-3 text-sm text-foreground/70">
                    {company.description || "No description provided."}
                  </p>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={companyStatusChipColor[company.status]}
                  >
                    {company.status}
                  </Chip>
                </Card.Content>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies yet"
          description="Companies will appear here once they have been approved."
          actionLabel="Register your company"
          actionHref="/employer/company"
        />
      )}
    </div>
  );
}
