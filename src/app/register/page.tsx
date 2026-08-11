"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@heroui/react";
import { useAuth, useRegister } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/error-message";
import { AuthShell } from "@/components/auth/auth-shell";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

function RoleCard({
  value,
  selected,
  onSelect,
  title,
  description,
}: {
  value: "JOB_SEEKER" | "EMPLOYER";
  selected: boolean;
  onSelect: (value: "JOB_SEEKER" | "EMPLOYER") => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-xl border-2 p-4 text-left transition ${
        selected
          ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
          : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
      }`}
    >
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const register = useRegister();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "JOB_SEEKER" },
  });

  const role = watch("role");

  if (authLoading) return null;
  if (user) {
    router.replace(user.role === "ADMIN" ? "/admin" : user.role === "EMPLOYER" ? "/employer" : "/dashboard");
    return null;
  }

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    try {
      const user = await register.mutateAsync(values);
      router.push(user.role === "EMPLOYER" ? "/employer" : "/dashboard");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <AuthShell>
      <Card.Header className="flex-col items-start gap-1">
        <Card.Title className="text-2xl">Create your account</Card.Title>
        <Card.Description>Join HireFlow as a job seeker or employer</Card.Description>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RoleCard
              value="JOB_SEEKER"
              selected={role === "JOB_SEEKER"}
              onSelect={(v) => setValue("role", v)}
              title="Job Seeker"
              description="Find a job and apply"
            />
            <RoleCard
              value="EMPLOYER"
              selected={role === "EMPLOYER"}
              onSelect={(v) => setValue("role", v)}
              title="Employer"
              description="Post jobs and hire"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              {...registerField("name")}
              placeholder="Full name"
              aria-label="Full name"
              className="w-full"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              {...registerField("email")}
              type="email"
              placeholder="you@example.com"
              aria-label="Email"
              className="w-full"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              {...registerField("password")}
              type="password"
              placeholder="Password (min 6 characters)"
              aria-label="Password"
              className="w-full"
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth isDisabled={register.isPending}>
            {register.isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer className="justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            Login
          </Link>
        </p>
      </Card.Footer>
    </AuthShell>
  );
}