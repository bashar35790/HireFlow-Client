"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Chip, TextArea } from "@heroui/react";
import { useCompany } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/error-message";
import { formatDate } from "@/lib/format";
import { companyStatusChipColor } from "@/lib/constants";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-foreground/30">{"★".repeat(5 - rating)}</span>
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

  if (isLoading) return <Loading />;
  if (isError || !company)
    return (
      <ErrorState message="Company not found." onRetry={() => refetch()} />
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
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-4 text-sm text-foreground/60">
        <Link
          href="/companies"
          className="hover:text-foreground dark:hover:text-foreground/10"
        >
          ← Back to companies
        </Link>
      </div>

      <Card variant="secondary">
        <Card.Header className="gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-foreground/10 text-2xl font-bold text-foreground/70">
            {company.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {company.name}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {company.location}
            </p>
          </div>
          <Chip
            size="sm"
            variant="soft"
            color={companyStatusChipColor[company.status]}
          >
            {company.status}
          </Chip>
        </Card.Header>
        <Card.Content className="gap-3">
          <p className="text-foreground/80">
            {company.description || "No description provided."}
          </p>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground underline"
            >
              Visit website
            </a>
          )}
        </Card.Content>
        <Card.Footer>
          <Link href="/jobs?category=">
            <Button variant="outline" size="sm">
              See jobs
            </Button>
          </Link>
        </Card.Footer>
      </Card>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Reviews</h2>
          {user?.role === "JOB_SEEKER" && (
            <Button
              variant="primary"
              size="sm"
              onPress={() => setIsReviewFormOpen((v) => !v)}
            >
              {isReviewFormOpen ? "Cancel" : "Write a review"}
            </Button>
          )}
        </div>

        {isReviewFormOpen && (
          <Card variant="secondary" className="mb-6">
            <Card.Content className="gap-4">
              {formError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-2xl transition ${
                        n <= rating ? "text-amber-500" : "text-foreground/30"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this company…"
                rows={4}
                className="w-full"
              />
              <Button
                variant="primary"
                isDisabled={createReview.isPending}
                onPress={submitReview}
              >
                {createReview.isPending ? "Submitting…" : "Submit review"}
              </Button>
            </Card.Content>
          </Card>
        )}

        {reviewsLoading ? (
          <Loading />
        ) : reviewsError ? (
          <ErrorState
            message="Failed to load reviews."
            onRetry={() => refetchReviews()}
          />
        ) : reviews && reviews.data.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews.data.map((review) => (
              <Card key={review.id} variant="secondary">
                <Card.Header className="gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground/70">
                    {review.user?.name?.[0] ?? "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {review.user?.name ?? "Anonymous"}
                    </p>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="text-xs text-foreground/50">
                    {formatDate(review.createdAt)}
                  </span>
                </Card.Header>
                {review.comment && (
                  <Card.Content>
                    <p className="text-sm text-foreground/70">
                      {review.comment}
                    </p>
                  </Card.Content>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            No reviews yet. Be the first to share your experience.
          </p>
        )}
      </section>
    </div>
  );
}
