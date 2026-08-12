"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useJob } from "@/hooks/useJobs";
import { useApplyToJob } from "@/hooks/useApplications";
import { RouteGuard } from "@/components/shared/route-guard";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/error-message";
import { JOB_TYPES_MAP } from "@/lib/constants";
import { formatSalary } from "@/lib/format";

const applySchema = z.object({
  coverLetter: z
    .string()
    .max(5000, "Cover letter is too long")
    .optional()
    .or(z.literal("")),
  resume: z
    .string()
    .max(1000, "Resume link is too long")
    .optional()
    .or(z.literal("")),
});

type ApplyValues = z.infer<typeof applySchema>;

export default function ApplyPage() {
  return (
    <RouteGuard roles={["JOB_SEEKER"]}>
      <ApplyForm />
    </RouteGuard>
  );
}

function ApplyForm() {
  const params = useParams<{ id: string }>();
  const { data: job, isLoading } = useJob(params.id);
  const apply = useApplyToJob();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyValues>({ resolver: zodResolver(applySchema) });

  async function onSubmit(values: ApplyValues) {
    setFormError(null);
    try {
      await apply.mutateAsync({
        jobId: params.id,
        resume: values.resume || undefined,
        coverLetter: values.coverLetter || undefined,
      });
      setDone(true);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  if (!job) return <ErrorState message="Job not found." />;

  /* ── Success state ── */
  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg rounded-3xl bg-card border border-card-border p-10 text-center shadow-2xl shadow-primary/5"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-[#f04c24]/10 text-4xl text-primary"
          >
            ✓
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Application Submitted
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              You&apos;re in the running!
            </h1>
            <p className="mt-3 text-base font-light leading-relaxed text-foreground/60">
              Your application for{" "}
              <span className="font-semibold text-foreground">{job.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-foreground">
                {job.company?.name}
              </span>{" "}
              has been received. Track its status from your dashboard.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-linear-to-r from-primary to-[#f04c24] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/jobs"
                className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
              >
                Browse More Jobs
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href={`/jobs/${job.id}`}
          className="group inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Job
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* ── Left: Job info panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Job header card */}
          <div className="rounded-3xl bg-card border border-card-border p-8 shadow-sm">
            {/* Company avatar + title */}
            <div className="flex items-start gap-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/10 text-2xl font-bold text-primary shadow-inner">
                {job.company?.name?.[0] ?? "J"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  You are applying for
                </p>
                <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                  {job.title}
                </h1>
                <p className="mt-1 text-sm font-medium text-foreground/60">
                  {job.company?.name ?? "Exclusive Partner"} · {job.location}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary border border-primary/20">
                {JOB_TYPES_MAP[job.jobType] ?? job.jobType}
              </span>
              {job.category?.name && (
                <span className="inline-flex items-center rounded-full bg-foreground/5 px-3.5 py-1 text-xs font-semibold text-foreground/70 border border-foreground/10">
                  {job.category.name}
                </span>
              )}
              {job.salaryMin != null && (
                <span className="inline-flex items-center rounded-full bg-[#f04c24]/10 px-3.5 py-1 text-xs font-semibold text-[#f04c24] border border-[#f04c24]/20">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              )}
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-3xl bg-card border border-card-border p-8 shadow-sm">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-foreground/50">
              What happens next
            </h2>
            <ol className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Application Received",
                  body: "The employer is notified of your application instantly.",
                },
                {
                  step: "02",
                  title: "Profile Review",
                  body: "Your cover letter and resume are reviewed by the hiring team.",
                },
                {
                  step: "03",
                  title: "Interview Invitation",
                  body: "If shortlisted, you'll be contacted for the next steps.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary border border-primary/10">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs font-light text-foreground/60">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* ── Right: Application form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="sticky top-52 rounded-3xl bg-card border border-card-border p-8 shadow-xl shadow-primary/5">
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Application Form
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Make your case
              </h2>
              <p className="mt-2 text-sm font-light text-foreground/60">
                Both fields are optional — but a great cover letter goes a long way.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative mt-7 flex flex-col gap-5"
            >
              {/* Error banner */}
              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}

              {/* Resume URL */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Resume / CV Link
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </span>
                  <input
                    {...register("resume")}
                    type="url"
                    placeholder="https://drive.google.com/your-resume"
                    aria-label="Resume URL"
                    className="w-full rounded-xl border border-card-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {errors.resume && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.resume.message}
                  </p>
                )}
              </div>

              {/* Cover letter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  Cover Letter
                </label>
                <textarea
                  {...register("coverLetter")}
                  placeholder="Tell the employer why you're a great fit for this role…"
                  aria-label="Cover letter"
                  rows={7}
                  className="w-full resize-none rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {errors.coverLetter && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.coverLetter.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={apply.isPending}
                className="mt-2 w-full rounded-full bg-linear-to-r from-primary to-[#f04c24] py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {apply.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>

              <p className="text-center text-xs font-light text-foreground/40">
                By applying, you agree to HireFlow&apos;s{" "}
                <span className="text-primary">Terms of Service</span>.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
