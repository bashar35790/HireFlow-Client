"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/5 bg-background">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 border-b border-foreground/5 pb-14 lg:grid-cols-12">

          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#f04c24] text-sm font-bold text-white shadow-md shadow-primary/20">
                H
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">HireFlow</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-foreground/55">
              Curating the world&apos;s most exceptional talent for organizations
              that demand excellence.
            </p>

            {/* Social icons */}
            <div className="mt-8 flex gap-3">
              {[
                { label: "Twitter / X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-card text-foreground/40 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                Platform
              </h3>
              <ul className="space-y-3.5 text-sm font-light text-foreground/60">
                <li><Link href="/jobs" className="transition-colors hover:text-primary">The Collection</Link></li>
                <li><Link href="/companies" className="transition-colors hover:text-primary">Exclusive Partners</Link></li>
                <li><Link href="/register" className="transition-colors hover:text-primary">Membership</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                Company
              </h3>
              <ul className="space-y-3.5 text-sm font-light text-foreground/60">
                <li><Link href="#" className="transition-colors hover:text-primary">Our Story</Link></li>
                <li><Link href="#" className="transition-colors hover:text-primary">Manifesto</Link></li>
                <li><Link href="#" className="transition-colors hover:text-primary">Concierge</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                Insider Access
              </h3>
              <p className="mb-4 text-xs font-light leading-relaxed text-foreground/55">
                Receive curated opportunities reserved for our exclusive network.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-2.5"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-foreground/10 bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition focus:border-primary/40 focus:ring-1 focus:ring-primary/15"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-foreground py-2.5 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:bg-foreground/90 hover:shadow-lg"
                >
                  Request Access
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs font-light text-foreground/35">
            © {new Date().getFullYear()} HireFlow, Inc. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs font-light text-foreground/35">
            <Link href="#" className="transition-colors hover:text-foreground/70">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-foreground/70">Terms</Link>
            <Link href="#" className="transition-colors hover:text-foreground/70">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
