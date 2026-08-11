"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@heroui/react";
import { useAuth, useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/error-message";
import { AuthShell } from "@/components/auth/auth-shell";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function redirectFor(user: { role: string }, next?: string | null) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return user.role === "ADMIN" ? "/admin" : user.role === "EMPLOYER" ? "/employer" : "/dashboard";
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { user, isLoading: authLoading } = useAuth();
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  if (authLoading) return null;
  if (user) {
    router.replace(redirectFor(user, next));
    return null;
  }

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      const authed = await login.mutateAsync(values);
      router.push(redirectFor(authed, next));
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <AuthShell>
      <Card.Header className="flex-col items-start gap-1">
        <Card.Title className="text-2xl">Welcome back</Card.Title>
        <Card.Description>Sign in to your HireFlow account</Card.Description>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {formError}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              aria-label="Email"
              className="w-full"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              aria-label="Password"
              className="w-full"
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth isDisabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card.Content>
      <Card.Footer className="justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            Register
          </Link>
        </p>
      </Card.Footer>
    </AuthShell>
  );
}