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

export function Header() {
  const { user, isAuthenticated, isLoading, logout, isPendingLogout } = useHeaderState();
  const router = useRouter();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/");
  }

  const links = [...publicLinks, ...(user ? roleLinks[user.role] ?? [] : [])];

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/5 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#f04c24] text-lg font-bold text-white shadow-md shadow-primary/20">
            H
          </span>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            HireFlow
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center items-center gap-2 md:flex">
          <div className="flex items-center rounded-full border border-foreground/10 bg-white/50 p-1 shadow-sm dark:bg-foreground/5 backdrop-blur-md">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} exact={link.href === "/"} />
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? null : isAuthenticated && user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {user.name}
                </p>
                <p className="text-xs font-medium text-primary">
                  {user.role.replace("_", " ").toLowerCase()}
                </p>
              </div>
              <Button variant="bordered" size="md" className="rounded-full border-foreground/20 text-foreground hover:border-primary hover:text-primary transition-all" isDisabled={isPendingLogout} onPress={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="light" size="md" className="rounded-full font-medium text-foreground hover:bg-foreground/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="solid" size="md" className="rounded-full bg-primary text-white shadow-md shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-foreground/5 px-4 py-3 md:hidden">
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