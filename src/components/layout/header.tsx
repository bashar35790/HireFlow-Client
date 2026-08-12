"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
];

const roleLinks: Record<string, { href: string; label: string }[]> = {
  JOB_SEEKER: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/saved", label: "Saved Jobs" },
  ],
  EMPLOYER: [
    { href: "/employer", label: "Employer" },
    { href: "/employer/company", label: "Company" },
    { href: "/employer/jobs", label: "My Jobs" },
  ],
  ADMIN: [{ href: "/admin", label: "Admin" }],
};

function NavLink({
  href,
  label,
  exact,
  onNavigate,
}: {
  href: string;
  label: string;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function AuthSection({ mobile = false }: { mobile?: boolean }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isPendingLogout = logout.isPending;
  const router = useRouter();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/");
  }

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return (
      <div
        className={
          mobile
            ? "flex flex-col items-stretch gap-3"
            : "flex items-center gap-3"
        }
      >
        <div className={mobile ? "text-center" : "hidden text-right sm:block"}>
          <p className="text-sm font-semibold leading-tight text-foreground">
            {user.name}
          </p>
          <p className="text-xs font-medium text-primary">
            {user.role.replace("_", "").toLowerCase()}
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          className="rounded-full border-foreground/20 text-foreground hover:border-primary hover:text-primary transition-all"
          isDisabled={isPendingLogout}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className={mobile ? "grid gap-3" : "flex items-center gap-3"}>
      <Link href="/login">
        <Button
          variant="ghost"
          size="md"
          className="w-full rounded-full font-medium text-foreground hover:bg-foreground/5"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button
          variant="primary"
          size="md"
          className="w-full rounded-full bg-primary text-white shadow-md shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
        >
          Join Now
        </Button>
      </Link>
    </div>
  );
}

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [...publicLinks, ...(user ? (roleLinks[user.role] ?? []) : [])];

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/5 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-transform hover:scale-105 sm:gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#f04c24] text-base font-bold text-white shadow-md shadow-primary/20 sm:size-10 sm:text-lg">
            H
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            HireFlow
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center items-center gap-2 md:flex">
          <div className="flex items-center rounded-full border border-[var(--card-border)] bg-card/80 p-1 shadow-sm backdrop-blur-md">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                exact={link.href === "/"}
              />
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <AuthSection />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/40"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-foreground/5 bg-background/95 px-4 pb-6 pt-4 backdrop-blur-xl sm:max-h-[calc(100dvh-80px)]">
            <nav className="flex flex-col items-stretch gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  exact={link.href === "/"}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-4 border-t border-foreground/10 pt-4">
              <AuthSection mobile />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}