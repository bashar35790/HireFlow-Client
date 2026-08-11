"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Company } from "@/lib/types";
import { useCreateCompany, useUpdateCompany } from "@/hooks/useCompanies";
import { getErrorMessage } from "@/lib/error-message";

const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  logo: z.string().max(500).optional().or(z.literal("")),
  website: z.string().max(500).optional().or(z.literal("")),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(200),
});

type CompanyValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  initialCompany?: Company;
}

/* ── Shared field classes ── */
const inputCls =
  "w-full rounded-xl border border-[var(--card-border)] bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelCls =
  "text-xs font-semibold uppercase tracking-widest text-foreground/50";

export function CompanyForm({ initialCompany }: CompanyFormProps) {
  const router = useRouter();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(initialCompany);
  const isPending = createCompany.isPending || updateCompany.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialCompany?.name ?? "",
      description: initialCompany?.description ?? "",
      logo: initialCompany?.logo ?? "",
      website: initialCompany?.website ?? "",
      location: initialCompany?.location ?? "",
    },
  });

  async function onSubmit(values: CompanyValues) {
    setFormError(null);
    const payload = {
      name: values.name,
      description: values.description || undefined,
      logo: values.logo || undefined,
      website: values.website || undefined,
      location: values.location,
    };
    try {
      if (initialCompany) {
        await updateCompany.mutateAsync({ id: initialCompany.id, payload });
      } else {
        await createCompany.mutateAsync(payload);
      }
      router.push("/employer");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
      {/* Error banner */}
      {formError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/40 dark:text-red-400">
          {formError}
        </div>
      )}

      {/* Row 1 – Name + Location */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>
            Company Name <span className="text-primary">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="e.g. Acme Inc."
            className={inputCls}
          />
          {errors.name && (
            <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>
            Location <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <input
              {...register("location")}
              placeholder="e.g. Dhaka, Bangladesh"
              className={`${inputCls} pl-10`}
            />
          </div>
          {errors.location && (
            <p className="text-xs font-medium text-red-500">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Row 2 – Website + Logo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Website</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
            <input
              {...register("website")}
              type="url"
              placeholder="https://yourcompany.com"
              className={`${inputCls} pl-10`}
            />
          </div>
          {errors.website && (
            <p className="text-xs font-medium text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Logo URL</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              {...register("logo")}
              type="url"
              placeholder="https://…/logo.png"
              className={`${inputCls} pl-10`}
            />
          </div>
          {errors.logo && (
            <p className="text-xs font-medium text-red-500">{errors.logo.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>About the Company</label>
        <textarea
          {...register("description")}
          rows={6}
          placeholder="Tell job seekers about your company's mission, culture and values…"
          className={`${inputCls} resize-none`}
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--card-border)] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Company"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground/70 transition-all hover:border-foreground/40 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
