import Link from "next/link";
import { Button } from "@heroui/react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background pt-24 pb-12 border-t border-foreground/5">
      {/* Subtle luxury background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 border-b border-foreground/5 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#f04c24] text-sm font-bold text-white shadow-md shadow-primary/20">
                H
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                HireFlow
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-foreground/60 max-w-xs font-light">
              Curating the world&apos;s most exceptional talent for organizations that demand excellence. The premium standard in career advancement.
            </p>
            <div className="mt-8 flex gap-4">
              {/* Social Icons (Placeholder SVGs) */}
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a key={social} href="#" className="flex size-10 items-center justify-center rounded-full border border-[var(--card-border)] bg-card text-foreground/50 transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5">
                  <span className="sr-only">{social}</span>
                  <div className="size-4 rounded-sm bg-current opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-6">
                Platform
              </h3>
              <ul className="space-y-4 text-sm font-light text-foreground/60">
                <li><Link href="/jobs" className="transition-colors hover:text-primary">The Collection</Link></li>
                <li><Link href="/companies" className="transition-colors hover:text-primary">Exclusive Partners</Link></li>
                <li><Link href="/pricing" className="transition-colors hover:text-primary">Membership</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-6">
                Company
              </h3>
              <ul className="space-y-4 text-sm font-light text-foreground/60">
                <li><Link href="/about" className="transition-colors hover:text-primary">Our Story</Link></li>
                <li><Link href="/manifesto" className="transition-colors hover:text-primary">Manifesto</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-primary">Concierge</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-6">
                Insider Access
              </h3>
              <p className="mb-4 text-xs font-light text-foreground/60 leading-relaxed">
                Receive curated opportunities and insights reserved for our exclusive network.
              </p>
              <form className="flex max-w-sm flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full rounded-xl border border-[var(--card-border)] bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="w-full rounded-xl bg-foreground text-background font-medium shadow-md transition-all hover:bg-foreground/90"
                >
                  Request Access
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs font-light text-foreground/40">
          <p>© {new Date().getFullYear()} HireFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
