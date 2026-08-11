"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label, TextArea } from "@heroui/react";
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

export function CompanyForm({ initialCompany }: CompanyFormProps) {
  const router = useRouter();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(initialCompany);

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
      {formError && (
        <div className="rounded-xl bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700 border border-red-200 backdrop-blur-sm dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
          {formError}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-foreground">Company name</Label>
        <Input
          {...register("name")}
          placeholder="e.g. Acme Inc."
          className="w-full bg-foreground/5 transition-colors focus-within:bg-foreground/10"
        />
        {errors.name && (
          <p className="text-xs font-medium text-[#f04c24] mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-foreground">Location</Label>
        <Input
          {...register("location")}
          placeholder="e.g. Dhaka, Bangladesh"
          className="w-full bg-foreground/5 transition-colors focus-within:bg-foreground/10"
        />
        {errors.location && (
          <p className="text-xs font-medium text-[#f04c24] mt-1">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">Website</Label>
          <Input
            {...register("website")}
            placeholder="https://acme.example"
            className="w-full bg-foreground/5 transition-colors focus-within:bg-foreground/10"
          />
          {errors.website && (
            <p className="text-xs font-medium text-[#f04c24] mt-1">{errors.website.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">Logo URL</Label>
          <Input
            {...register("logo")}
            placeholder="https://…/logo.png"
            className="w-full bg-foreground/5 transition-colors focus-within:bg-foreground/10"
          />
          {errors.logo && (
            <p className="text-xs font-medium text-[#f04c24] mt-1">{errors.logo.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-foreground">Description</Label>
        <TextArea
          {...register("description")}
          rows={5}
          placeholder="Tell job seekers about your company's mission and premium values..."
          className="w-full bg-foreground/5 transition-colors focus-within:bg-foreground/10"
        />
        {errors.description && (
          <p className="text-xs font-medium text-[#f04c24] mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-foreground/10">
        <Button
          type="submit"
          size="lg"
          className="rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
          isDisabled={createCompany.isPending || updateCompany.isPending}
        >
          {createCompany.isPending || updateCompany.isPending
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create company"}
        </Button>
        <Button 
          variant="ghost" 
          size="lg" 
          onPress={() => router.back()}
          className="rounded-full font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
