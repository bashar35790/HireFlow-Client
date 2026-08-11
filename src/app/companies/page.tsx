"use client";

import Link from "next/link";
import { Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { useCompanies } from "@/hooks/useCompanies";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { companyStatusChipColor } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CompaniesPage() {
  const { isEmployer, isAdmin } = useAuth();
  const { data, isLoading, isError, refetch } = useCompanies({
    status: "APPROVED",
    limit: 100,
  });

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Exclusive Network
          </h1>
          <p className="mt-4 text-lg font-light text-foreground/70 max-w-xl">
            Explore the world's most premium brands and organizations actively looking for top-tier talent on HireFlow.
          </p>
        </div>
        {(isEmployer || isAdmin) && (
          <Link href="/employer/company">
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary-hover">
              Register your company
            </button>
          </Link>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <div className="mt-10">
          <ErrorState
            message="Could not load companies."
            onRetry={() => refetch()}
          />
        </div>
      ) : data && data.data.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {data.data.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`} className="group h-full">
              <motion.div
                variants={cardVariants}
                className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-colors duration-500 group-hover:from-primary/5 group-hover:to-transparent" />
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-2xl font-bold text-primary shadow-inner transition-transform duration-300 group-hover:scale-110">
                    {company.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {company.name}
                    </h2>
                    <p className="truncate text-sm font-medium text-foreground/60">
                      {company.location}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex flex-1 flex-col justify-between gap-4">
                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-foreground/80">
                    {company.description || "No description provided."}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between border-t border-foreground/5 pt-4">
                    <span className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/70">
                      View Profile
                      <span className="ml-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">→</span>
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${company.status === 'APPROVED' ? 'bg-primary/10 text-primary' : 'bg-foreground/10 text-foreground'}`}>
                      {company.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
          <EmptyState
            title="No partners found"
            description="Our exclusive network of companies will appear here once approved."
            actionLabel="Register your company"
            actionHref="/employer/company"
          />
        </motion.div>
      )}
    </div>
  );
}
