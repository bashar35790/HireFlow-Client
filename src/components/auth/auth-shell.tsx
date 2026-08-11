"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const features = [
  {
    title: "Curated Opportunities",
    description: "A hand-picked collection of premium roles.",
  },
  {
    title: "Elite Network",
    description: "Connect with companies that value excellence.",
  },
  {
    title: "Concierge Support",
    description: "Guidance at every step of your journey.",
  },
];

const stats = [
  { value: "12k+", label: "Placements" },
  { value: "500+", label: "Partners" },
  { value: "98%", label: "Satisfaction" },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 overflow-hidden bg-background">
      {/* Decorative Luxury Gradients */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#f04c24]/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd9a0]/25 blur-[110px] dark:bg-[#fc5810]/5" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-20 lg:px-8 lg:py-20">
        {/* Brand Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="hidden flex-col lg:flex"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            HireFlow · Premium Recruitment
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-xl text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground"
          >
            Your next chapter{" "}
            <span className="bg-gradient-to-r from-primary to-[#f04c24] bg-clip-text text-transparent drop-shadow-sm">
              begins here
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-lg font-light leading-relaxed text-foreground/70"
          >
            {description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-12 space-y-5 border-l border-primary/20 pl-6"
          >
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="mt-1.5 flex size-2 shrink-0 rounded-full bg-gradient-to-br from-primary to-[#f04c24]" />
                <div>
                  <p className="font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-sm font-light text-foreground/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 flex items-center gap-10 border-t border-foreground/10 pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="bg-gradient-to-r from-primary to-[#f04c24] bg-clip-text text-3xl font-extrabold text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-foreground/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto w-full max-w-md"
        >
          <motion.div
            variants={fadeUp}
            className="glass relative rounded-3xl p-8 shadow-2xl shadow-primary/5 sm:p-10"
          >
            {/* Logo */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-3 transition-transform hover:scale-105"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#f04c24] text-lg font-bold text-white shadow-md shadow-primary/20">
                H
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                HireFlow
              </span>
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                {title}
              </h2>
            </div>

            {children}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 text-center">
            {footer}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
