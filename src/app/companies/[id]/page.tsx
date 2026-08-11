"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, TextArea } from "@heroui/react";
import { motion, Variants } from "framer-motion";
import { useCompany } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate, formatUrl } from "@/lib/format";
import type { CompanyStatus } from "@/lib/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

function Stars({
  rating,
  size = "text-amber-500",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span className={`${size} leading-none`}>
      {"★".repeat(rating)}
      <span className="text-foreground/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const styles: Record<CompanyStatus, string> = {
    APPROVED:
      "bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5",
    PENDING:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="flex h-1.5 w-1.5 rounded-full bg-current" />
      {status === "APPROVED"
        ? "Verified Partner"
        : status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: company, isLoading, isError, refetch } = useCompany(params.id);
  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useReviews(params.id);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const reviewsList = useMemo(() => reviews?.data ?? [], [reviews]);
  const avgRating = useMemo(
    () =>
      reviewsList.length
        ? Math.round(
            (reviewsList.reduce((sum, r) => sum + r.rating, 0) /
              reviewsList.length) *
              10,
          ) / 10
        : 0,
    [reviewsList],
  );

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  if (isError || !company)
    return (
      <div className="mt-10">
        <ErrorState message="Company not found." onRetry={() => refetch()} />
      </div>
    );
  const activeCompany = company;

  async function submitReview() {
    setFormError(null);
    if (rating === 0) {
      setFormError("Please select a rating from 1 to 5.");
      return;
    }
    try {
      await createReview.mutateAsync({
        companyId: activeCompany.id,
        rating,
        comment: comment || undefined,
      });
      setRating(0);
      setComment("");
      setIsReviewFormOpen(false);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl flex-1 overflow-hidden px-4 py-12 sm:px-6 lg:py-16">
      {/* Decorative Luxury Gradients */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#f04c24]/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 mb-8"
      >
        <Link
          href="/companies"
          className="group inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
        >
          <span className="mr-2 transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to Exclusive Network
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10"
      >
        <motion.div
          variants={fadeUp}
          className="glass relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/5"
        >
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <motion.div
                variants={fadeUp}
                className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-[#f04c24] text-3xl font-bold text-white shadow-lg shadow-primary/30 sm:size-24 sm:text-4xl"
              >
                {activeCompany.name[0]}
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {activeCompany.name}
                  </h1>
                  <StatusBadge status={activeCompany.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {activeCompany.location}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-foreground/30" />
                  <span>Member since {formatDate(activeCompany.createdAt)}</span>
                </div>
              </div>
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-foreground/80"
            >
              {activeCompany.description || "No description provided."}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-8"
            >
              <Link href="/jobs?category=">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary to-[#f04c24] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Open Roles
                </Button>
              </Link>
              {activeCompany.website && (
                <a
                  href={formatUrl(activeCompany.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  Visit Website
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
              <div className="ml-auto flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-foreground">
                    {avgRating || "—"}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-foreground/50">
                    Avg Rating
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-foreground">
                    {reviewsList.length}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-foreground/50">
                    Reviews
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Reviews */}
      <section className="relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-4 border-b border-foreground/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Testimonials
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Client &amp; Employee Reviews
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <Stars rating={Math.round(avgRating)} size="text-lg text-amber-500" />
              <span className="text-sm font-medium text-foreground/60">
                {avgRating
                  ? `${avgRating} average from ${reviewsList.length} review${reviewsList.length === 1 ? "" : "s"}`
                  : "No ratings yet"}
              </span>
            </div>
          </div>
          {user?.role === "JOB_SEEKER" && (
            <Button
              size="lg"
              variant={isReviewFormOpen ? "outline" : "primary"}
              onPress={() => setIsReviewFormOpen((v) => !v)}
              className={
                isReviewFormOpen
                  ? "rounded-full border-foreground/20 text-foreground hover:border-primary hover:text-primary transition-all"
                  : "rounded-full bg-gradient-to-r from-primary to-[#f04c24] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]"
              }
            >
              {isReviewFormOpen ? "Cancel" : "Write a Review"}
            </Button>
          )}
        </motion.div>

        {isReviewFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass mb-8 rounded-3xl p-6 shadow-xl shadow-primary/5 sm:p-8"
          >
            {formError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/40 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
                  Your Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-3xl transition-all hover:scale-110 ${
                        n <= rating
                          ? "text-amber-500 drop-shadow"
                          : "text-foreground/20 hover:text-amber-400/50"
                      }`}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
                  Your Experience
                </label>
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience working with or alongside this company…"
                  rows={4}
                  className="w-full rounded-xl border border-foreground/10 bg-white/70 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-black/30"
                />
              </div>
              <Button
                size="lg"
                isDisabled={createReview.isPending}
                onPress={submitReview}
                className="w-fit rounded-full bg-gradient-to-r from-primary to-[#f04c24] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]"
              >
                {createReview.isPending ? "Submitting…" : "Submit Review"}
              </Button>
            </div>
          </motion.div>
        )}

        {reviewsLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loading />
          </div>
        ) : reviewsError ? (
          <ErrorState
            message="Failed to load reviews."
            onRetry={() => refetchReviews()}
          />
        ) : reviewsList.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5"
          >
            {reviewsList.map((review) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/10 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-[#f04c24]/5 text-base font-bold text-primary shadow-inner ring-1 ring-primary/10">
                      {review.user?.name?.[0] ?? "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.user?.name ?? "Anonymous"}
                      </p>
                      <Stars rating={review.rating} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground/50">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-4 border-l-2 border-primary/20 pl-4 text-sm font-light leading-relaxed text-foreground/70">
                    {review.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/20 py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground">
              No reviews yet
            </h3>
            <p className="mt-2 max-w-sm text-sm font-light text-foreground/60">
              Be the first to share your experience with this premium partner.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
