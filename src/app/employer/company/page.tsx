"use client";

import Link from "next/link";
import { RouteGuard } from "@/components/shared/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompany } from "@/hooks/useCompanies";
import { CompanyForm } from "@/components/employer/company-form";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { motion } from "framer-motion";

export default function CompanyPage() {
  return (
    <RouteGuard roles={["EMPLOYER"]}>
      <CompanyManage />
    </RouteGuard>
  );
}

function CompanyManage() {
  const { user } = useAuth();
  const { data: company, isLoading, isError, refetch } = useMyCompany(user?.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="mt-10">
        <ErrorState
          message="Failed to load your company."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href="/employer"
          className="group inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative overflow-hidden rounded-3xl"
      >
        {/* Decorative subtle background elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="relative p-6 sm:p-10">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Company Profile
              </h1>
              <p className="mt-2 text-foreground/70 text-lg font-light">
                {company ? "Update and refine your brand's presence" : "Establish your company's premium profile"}
              </p>
            </div>
            {company && (
              <Link
                href={`/companies/${company.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
              >
                View Public Profile
                <span className="text-base">↗</span>
              </Link>
            )}
          </div>
          
          <CompanyForm initialCompany={company ?? undefined} />
        </div>
      </motion.div>
    </div>
  );
}
