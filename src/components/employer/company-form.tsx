"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Label, TextArea } from "@heroui/react";
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
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>
          {isEdit ? "Edit company" : "Create your company profile"}
        </Card.Title>
        <Card.Description>
          Your company profile will be shown to job seekers who browse
          companies.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Company name</Label>
            <Input
              {...register("name")}
              placeholder="e.g. Acme Inc."
              className="w-full"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Location</Label>
            <Input
              {...register("location")}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full"
            />
            {errors.location && (
              <p className="text-xs text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Website</Label>
              <Input
                {...register("website")}
                placeholder="https://acme.example"
                className="w-full"
              />
              {errors.website && (
                <p className="text-xs text-red-600">{errors.website.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Logo URL</Label>
              <Input
                {...register("logo")}
                placeholder="https://…/logo.png"
                className="w-full"
              />
              {errors.logo && (
                <p className="text-xs text-red-600">{errors.logo.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Description</Label>
            <TextArea
              {...register("description")}
              rows={5}
              placeholder="Tell job seekers about your company…"
              className="w-full"
            />
            {errors.description && (
              <p className="text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isDisabled={createCompany.isPending || updateCompany.isPending}
            >
              {createCompany.isPending || updateCompany.isPending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create company"}
            </Button>
            <Button variant="ghost" size="lg" onPress={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
