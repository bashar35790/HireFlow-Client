"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, TextArea } from "@heroui/react";
import { useJob } from "@/hooks/useJobs";
import { useApplyToJob } from "@/hooks/useApplications";
import { RouteGuard } from "@/components/shared/route-guard";
import { Loading } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/error-message";

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

  if (isLoading) return <Loading />;
  if (!job) return <ErrorState message="Job not found." />;

  if (done) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700 dark:bg-green-950">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Application submitted!
        </h1>
        <p className="mt-2 text-foreground/60">
          Your application for <span className="font-medium">{job.title}</span>{" "}
          has been received. You can track its status from your dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard">
            <Button variant="primary">Go to dashboard</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost">Browse more jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-4 text-sm text-foreground/60">
        <Link
          href={`/jobs/${job.id}`}
          className="hover:text-foreground dark:hover:text-foreground/10"
        >
          ← Back to job
        </Link>
      </div>
      <Card variant="secondary">
        <Card.Header className="flex-col items-start gap-1">
          <Card.Title className="text-2xl">Apply for {job.title}</Card.Title>
          <Card.Description>
            {job.company?.name} · {job.location}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formError && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Input
                {...register("resume")}
                placeholder="Link to your resume (URL)"
                aria-label="Resume URL"
                className="w-full"
              />
              {errors.resume && (
                <p className="text-xs text-red-600">{errors.resume.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <TextArea
                {...register("coverLetter")}
                placeholder="Why are you a good fit for this role? (optional)"
                aria-label="Cover letter"
                rows={6}
                className="w-full"
              />
              {errors.coverLetter && (
                <p className="text-xs text-red-600">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={apply.isPending}
            >
              {apply.isPending ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
