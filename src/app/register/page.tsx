"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label } from "@heroui/react";
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
  icon,
}: {
  value: "JOB_SEEKER" | "EMPLOYER";
  selected: boolean;
  onSelect: (value: "JOB_SEEKER" | "EMPLOYER") => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`group relative flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-all duration-300 ${
        selected
          ? "border border-primary/60 bg-gradient-to-br from-primary/10 to-[#f04c24]/5 shadow-lg shadow-primary/10"
          : "border border-[var(--card-border)] bg-card hover:border-primary/40 hover:bg-muted dark:bg-card dark:hover:bg-muted"
      }`}
    >
      <span
        className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-gradient-to-br from-primary to-[#f04c24] text-white shadow-md shadow-primary/30"
            : "bg-foreground/5 text-foreground/60 group-hover:text-primary"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm font-light text-foreground/60">
          {description}
        </p>
      </div>
      <span
        className={`absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border transition-colors ${
          selected
            ? "border-primary bg-primary text-white"
            : "border-foreground/20 text-transparent"
        }`}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const register = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "EMPLOYER"
            ? "/employer"
            : "/dashboard",
      );
    }
  }, [authLoading, user, router]);

  if (!mounted || authLoading) return null;
  if (user) return null;

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
    <AuthShell
      eyebrow="Join the elite"
      title="Create your account"
      description="Join HireFlow — the premium destination where exceptional talent meets exceptional companies. Begin your journey today."
      footer={
        <p className="text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign in
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
            I am a…
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RoleCard
              value="JOB_SEEKER"
              selected={role === "JOB_SEEKER"}
              onSelect={(v) => setValue("role", v)}
              title="Job Seeker"
              description="Find premium roles"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              }
            />
            <RoleCard
              value="EMPLOYER"
              selected={role === "EMPLOYER"}
              onSelect={(v) => setValue("role", v)}
              title="Employer"
              description="Hire exceptional talent"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Full Name
          </Label>
          <Input
            {...registerField("name")}
            placeholder="Your full name"
            aria-label="Full name"
            className="w-full rounded-xl border border-[var(--card-border)] bg-card px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-card"
          />
          {errors.name && (
            <p className="text-xs font-medium text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Email
          </Label>
          <Input
            {...registerField("email")}
            type="email"
            placeholder="you@example.com"
            aria-label="Email"
            className="w-full rounded-xl border border-[var(--card-border)] bg-card px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-card"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Password
          </Label>
          <Input
            {...registerField("password")}
            type="password"
            placeholder="Minimum 6 characters"
            aria-label="Password"
            className="w-full rounded-xl border border-[var(--card-border)] bg-card px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-card"
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={register.isPending}
          className="mt-2 rounded-full bg-gradient-to-r from-primary to-[#f04c24] font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {register.isPending ? "Creating account…" : "Create Account"}
        </Button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-foreground/10" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/40">
            Member of the Elite
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-foreground/10" />
        </div>

        <p className="text-center text-xs font-light leading-relaxed text-foreground/50">
          By creating an account, you agree to our{" "}
          <span className="font-medium text-primary">Terms</span> and{" "}
          <span className="font-medium text-primary">Privacy Policy</span>.
        </p>
      </form>
    </AuthShell>
  );
}
