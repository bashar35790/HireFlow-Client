"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
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

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 sm:py-32 lg:py-40">
        {/* Decorative Luxury Gradients */}
        <div className="absolute top-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 h-[500px] w-[500px] rounded-full bg-[#f04c24]/10 blur-[120px] pointer-events-none" />

        <motion.div 
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Elevate Your Career with HireFlow
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Find the job that fits <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-[#f04c24] bg-clip-text text-transparent drop-shadow-sm">
              your lifestyle
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 sm:text-xl font-light leading-relaxed">
            Experience a curated selection of premium opportunities from companies that value excellence. Join our exclusive network of professionals today.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={submitSearch}
            className="mx-auto mt-12 flex w-full max-w-2xl items-center gap-3 rounded-full bg-white/70 p-3 shadow-2xl shadow-primary/5 ring-1 ring-black/5 backdrop-blur-xl dark:bg-black/40 dark:ring-white/10"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for premium roles, companies, or keywords..."
              aria-label="Search jobs"
              variant="flat"
              classNames={{
                input: "bg-transparent text-base placeholder:text-foreground/40",
                inputWrapper: "bg-transparent shadow-none hover:bg-transparent focus-within:!bg-transparent data-[hover=true]:bg-transparent"
              }}
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="rounded-full bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:scale-105"
            >
              Discover
            </Button>
          </motion.form>

          {!user && (
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-foreground px-8 font-medium text-background transition-transform hover:scale-105 shadow-xl">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="bordered" size="lg" className="rounded-full border-foreground/20 px-8 font-medium text-foreground transition-all hover:border-primary hover:text-primary">
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Latest Jobs Section */}
      <section className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 border-b border-foreground/10 pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Opportunities</h2>
            <p className="mt-2 text-foreground/60 font-light">
              Exclusive roles curated for exceptional talent
            </p>
          </div>
          <Link
            href="/jobs"
            className="group flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View all opportunities
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading />
          </div>
        ) : isError ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-3xl bg-red-50/50 text-red-600 dark:bg-red-900/10">
            <p className="font-medium">Unable to load opportunities. Please try again later.</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group h-full rounded-3xl bg-white p-2 transition-all hover:shadow-2xl hover:shadow-primary/10 dark:bg-foreground/5"
              >
                <div className="h-full rounded-2xl bg-background/50 border border-foreground/5 p-6 backdrop-blur-sm transition-colors group-hover:border-primary/20">
                  <JobCard job={job} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/20 py-24 text-center">
            <div className="mb-4 rounded-full bg-foreground/5 p-4 text-primary">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground">No roles available right now</h3>
            <p className="mt-2 text-foreground/60">Our premium collection is being updated. Check back soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}