"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { motion, Variants } from "framer-motion";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobs/job-card";
import { Loading } from "@/components/shared/loading";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    title: "Curated Opportunities",
    description: "Access a hand-picked selection of premium roles from top-tier companies.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Direct Access",
    description: "Skip the noise and connect directly with hiring managers and decision makers.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Elite Network",
    description: "Join a community of top-tier professionals and fast-growing organizations.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote: "HireFlow completely transformed my job search. I landed a senior role at a top-tier tech company within weeks.",
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    company: "TechNova",
  },
  {
    quote: "The quality of candidates on HireFlow is unmatched. We filled our engineering leadership roles faster than ever.",
    name: "Marcus Thorne",
    role: "Director of Engineering",
    company: "Apex Systems",
  },
  {
    quote: "A truly premium experience. The platform's interface is stunning, and the exclusive opportunities are exactly what I was looking for.",
    name: "Elena Rodriguez",
    role: "Lead UX Designer",
    company: "Studio Alpha",
  },
];

const FAQS = [
  {
    question: "What makes HireFlow different from other job boards?",
    answer: "HireFlow is an exclusive platform focused on premium, high-quality opportunities. We curate both our talent pool and employer network to ensure perfect matches.",
  },
  {
    question: "Is HireFlow free for job seekers?",
    answer: "Yes, our platform is completely free for job seekers. We believe in providing open access to premium career opportunities.",
  },
  {
    question: "How do you vet companies on the platform?",
    answer: "Every company must pass our strict quality standards before posting jobs. We evaluate company culture, compensation competitiveness, and growth opportunities.",
  },
  {
    question: "Can I remain anonymous while job hunting?",
    answer: "Absolutely. You have full control over your privacy settings and who can view your profile details.",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useJobs({ limit: 6 });

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    router.push(`/jobs${params}`);
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Hero Section — full viewport height, fully centered */}
      <section className="relative flex min-h-[calc(100svh-64px)] flex-col items-center justify-center overflow-hidden px-4 py-14 sm:min-h-[calc(100svh-80px)] sm:py-16">
        {/* Decorative Luxury Gradients */}
        <div className="absolute top-0 -left-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 h-[300px] w-[300px] rounded-full bg-[#f04c24]/10 blur-[100px] pointer-events-none sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

        <motion.div
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Elevate Your Career with HireFlow
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Find the job that fits <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-[#f04c24] bg-clip-text text-transparent drop-shadow-sm">
              your lifestyle
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-base text-foreground/70 sm:mt-6 sm:text-lg sm:text-xl font-light leading-relaxed"
          >
            Experience a curated selection of premium opportunities from
            companies that value excellence. Join our exclusive network of
            professionals today.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={submitSearch}
            className="mx-auto mt-12 w-full max-w-2xl"
          >
            <div className="flex items-center gap-0 rounded-2xl bg-card shadow-2xl shadow-primary/10 ring-1 ring-[var(--card-border)] overflow-hidden">
              {/* Search icon */}
              <span className="flex shrink-0 items-center pl-3 text-foreground/40 sm:pl-5">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles, companies, keywords…"
                aria-label="Search jobs"
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-foreground/40 outline-none sm:px-4 sm:py-4 sm:text-base"
              />
              <div className="p-1.5 sm:p-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-[#f04c24] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95 sm:px-7 sm:py-3 sm:text-sm"
                >
                  <span className="sm:hidden">Go</span>
                  <span className="hidden sm:inline">Discover</span>
                </button>
              </div>
            </div>
          </motion.form>

          {!user && (
            <motion.div
              variants={fadeUp}
              className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
            >
              <Link href="/register" className="w-full max-w-xs sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-foreground px-8 font-medium text-background transition-transform hover:scale-105 shadow-xl"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/jobs" className="w-full max-w-xs sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-foreground/20 px-8 font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Latest Jobs Section */}
      <section className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 border-b border-foreground/10 pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Opportunities
            </h2>
            <p className="mt-2 text-foreground/60 font-light">
              Exclusive roles curated for exceptional talent
            </p>
          </div>
          <Link
            href="/jobs"
            className="group flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View all opportunities
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading />
          </div>
        ) : isError ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-3xl bg-red-50/50 text-red-600 dark:bg-red-900/10">
            <p className="font-medium">
              Unable to load opportunities. Please try again later.
            </p>
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group h-full rounded-3xl bg-card p-2 transition-all hover:shadow-2xl hover:shadow-primary/10 dark:bg-card"
              >
                <div className="h-full rounded-2xl bg-background border border-[var(--card-border)] p-6 transition-colors group-hover:border-primary/20">
                  <JobCard job={job} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/20 py-24 text-center">
            <div className="mb-4 rounded-full bg-foreground/5 p-4 text-primary">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground">
              No roles available right now
            </h3>
            <p className="mt-2 text-foreground/60">
              Our premium collection is being updated. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="relative bg-card/30 border-y border-foreground/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose HireFlow
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-foreground/60 font-light">
              Experience a new standard in career progression. We provide the tools, network, and opportunities to accelerate your professional journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-3xl bg-card border border-[var(--card-border)] p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
              >
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/10 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by the Best
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-foreground/60 font-light">
              Don&apos;t just take our word for it. Hear from the professionals and companies who have found success on our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-3xl p-8 relative"
              >
                <svg className="absolute top-6 left-6 h-8 w-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="relative z-10 pt-6">
                  <p className="text-foreground/80 font-light leading-relaxed mb-8">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#f04c24] text-white font-bold shadow-md">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-foreground/60">
                        {testimonial.role} at <span className="font-semibold text-primary/80">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative bg-card/30 border-y border-foreground/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl bg-background border border-[var(--card-border)] p-8 transition-colors hover:border-primary/20"
              >
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-foreground/70 font-light leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-[#f04c24]/5" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-5xl rounded-3xl glass p-10 text-center sm:p-16 border border-primary/20 shadow-2xl shadow-primary/10"
        >
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#f04c24]/20 blur-[80px] pointer-events-none" />
          
          <h2 className="relative z-10 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            Ready to Elevate Your Career?
          </h2>
          <p className="relative z-10 mx-auto max-w-2xl text-foreground/70 font-light sm:text-lg mb-10">
            Join thousands of professionals discovering exclusive opportunities. Create your free account today and take the next step.
          </p>
          {!user && (
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary to-[#f04c24] px-10 py-6 text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-foreground/20 px-10 py-6 text-base font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
