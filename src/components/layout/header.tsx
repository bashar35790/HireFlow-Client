"use client";

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

function NavLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const { user, isAuthenticated, isLoading, logout, isPendingLogout } = useHeaderState();
  const router = useRouter();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/");
  }

  const links = [...publicLinks, ...(user ? roleLinks[user.role] ?? [] : [])];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            HireFlow
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 px-4 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} exact={link.href === "/"} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? null : isAuthenticated && user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user.role.replace("_", " ").toLowerCase()}
                </p>
              </div>
              <Button variant="outline" size="sm" isDisabled={isPendingLogout} onPress={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-zinc-200 px-4 py-2 md:hidden dark:border-zinc-800">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} exact={link.href === "/"} />
        ))}
      </nav>
    </header>
  );
}

function useHeaderState() {
  const auth = useAuth();
  const logout = auth.logout;
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    logout,
    isPendingLogout: logout.isPending,
  };
}