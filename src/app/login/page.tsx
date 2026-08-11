"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "@heroui/react";
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
  return user.role === "ADMIN"
    ? "/admin"
    : user.role === "EMPLOYER"
      ? "/employer"
      : "/dashboard";
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
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectFor(user, next));
    }
  }, [authLoading, user, next, router]);

  if (authLoading) return null;
  if (user) return null;

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
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Welcome back to HireFlow. Sign in to unlock premium roles, exclusive opportunities and your personalized career dashboard."
      footer={
        <p className="text-sm text-foreground/60">
          New to HireFlow?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {formError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950/50 dark:bg-red-950/40 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Email
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            aria-label="Email"
            className="w-full rounded-xl border border-foreground/10 bg-white/70 px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-black/30"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
              Password
            </Label>
            <button
              type="button"
              className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Forgot password?
            </button>
          </div>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            aria-label="Password"
            className="w-full rounded-xl border border-foreground/10 bg-white/70 px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-black/30"
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 accent-[#fc5810]"
          />
          Keep me signed in
        </label>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={login.isPending}
          className="mt-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {login.isPending ? "Signing in…" : "Sign In"}
        </Button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-foreground/10" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/40">
            Private Access
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-foreground/10" />
        </div>

        <p className="text-center text-xs font-light leading-relaxed text-foreground/50">
          By signing in, you agree to our{" "}
          <span className="font-medium text-primary">Terms</span> and{" "}
          <span className="font-medium text-primary">Privacy Policy</span>.
        </p>
      </form>
    </AuthShell>
  );
}
