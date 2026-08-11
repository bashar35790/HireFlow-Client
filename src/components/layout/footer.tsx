import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background dark:border-foreground/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-white shadow-sm">
              H
            </span>
            HireFlow
          </p>
          <p className="mt-2 text-sm text-foreground/60 font-light">
            Curated opportunities for premium talent.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-foreground/70">
          <Link href="/jobs" className="transition-colors hover:text-primary">
            Collection
          </Link>
          <Link href="/companies" className="transition-colors hover:text-primary">
            Partners
          </Link>
          <Link href="/register" className="transition-colors hover:text-primary">
            Membership
          </Link>
        </nav>
        <p className="text-xs text-foreground/40 font-light">
          © {new Date().getFullYear()} HireFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}