"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobs/job-card";
import { Loading } from "@/components/shared/loading";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    title: "Curated Opportunities",
    description: "Access a hand-picked selection of premium roles from top-tier companies. We filter the noise so you don't have to.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Direct Access",
    description: "Skip the gatekeepers. Connect directly with hiring managers and decision-makers who value exceptional talent.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Elite Network",
    description: "Join an exclusive community of top-tier professionals and fast-growing organizations shaping the future.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-foreground/10 last:border-0 py-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left group focus:outline-none"
      >
        <h3 className="text-xl sm:text-2xl font-medium text-foreground transition-colors group-hover:text-primary">
          {question}
        </h3>
        <span
          className="ml-6 flex size-12 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-card text-foreground/50 transition-all duration-500 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/10"
          style={{ transform: isOpen ? "rotate(135deg)" : "rotate(0deg)" }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-6 pr-12 text-foreground/60 font-light leading-relaxed text-lg">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Luxury Glow Effects */}
        <div className="absolute top-0 -left-1/4 h-125 w-125 rounded-full bg-primary/15 blur-[120px] pointer-events-none sm:h-150 sm:w-150 sm:blur-[150px]" />
        <div className="absolute bottom-0 -right-1/4 h-125 w-125 rounded-full bg-[#f04c24]/10 blur-[120px] pointer-events-none sm:h-150 sm:w-150 sm:blur-[150px]" />

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 mask-[radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

        <motion.div
          className="relative z-10 mx-auto max-w-5xl -mt-16 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse"></span>
            Elevate Your Career
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            The premium standard <br className="hidden sm:block" />
            <span className="font-serif italic font-medium bg-linear-to-r from-primary to-[#f04c24] bg-clip-text text-transparent">
              in recruitment.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-base text-foreground/60 sm:text-lg font-light leading-relaxed"
          >
            Experience a curated selection of exceptional opportunities from
            companies that demand excellence. Join our exclusive network today.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={submitSearch}
            className="mx-auto mt-8 w-full max-w-2xl"
          >
            <div className="relative rounded-2xl bg-linear-to-b from-card to-background p-px shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-[#f04c24]/20 to-primary/20 opacity-50 blur-xl" />
              <div className="relative flex items-center gap-0 rounded-2xl bg-card/80 backdrop-blur-xl">
                <span className="flex shrink-0 items-center pl-4 text-foreground/40 sm:pl-6">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                  </svg>
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roles, keywords, or companies…"
                  aria-label="Search jobs"
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-foreground/40 outline-none sm:px-5 sm:py-5 sm:text-base font-light"
                />
                <div className="p-2 sm:p-2.5">
                  <button
                    type="submit"
                    className="rounded-xl bg-foreground px-6 py-3 text-xs font-semibold text-background shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-8 sm:py-3.5 sm:text-sm uppercase tracking-wider"
                  >
                    <span className="sm:hidden">Go</span>
                    <span className="hidden sm:inline">Discover</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.form>

          {!user && (
            <motion.div
              variants={fadeUp}
              className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
            >
              <Link href="/register" className="w-full max-w-xs sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-linear-to-r from-primary to-[#f04c24] px-10 py-6 text-sm font-semibold text-white transition-transform hover:scale-105 shadow-xl shadow-primary/20"
                >
                  Join the Network
                </Button>
              </Link>
              <Link href="/jobs" className="w-full max-w-xs sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-foreground/20 px-10 py-6 text-sm font-medium text-foreground transition-all hover:border-foreground hover:bg-foreground/5"
                >
                  View Collection
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Latest Jobs Section */}
      <section className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col items-center justify-between gap-6 border-b border-foreground/10 pb-8 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              The Collection
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Featured Roles
            </h2>
          </div>
          <Link
            href="/jobs"
            className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-foreground/60 transition-colors hover:text-primary"
          >
            Explore all
            <span className="transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex min-h-100 items-center justify-center">
            <Loading />
          </div>
        ) : isError ? (
          <div className="flex min-h-100 items-center justify-center rounded-3xl bg-red-50/50 text-red-600 dark:bg-red-900/10 border border-red-500/20">
            <p className="font-medium">
              Unable to load the collection. Please try again later.
            </p>
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full rounded-3xl bg-card/50 p-2 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:bg-card border border-transparent hover:border-card-border"
              >
                <div className="h-full rounded-2xl bg-background border border-card-border p-8 transition-colors duration-500 group-hover:border-primary/20">
                  <JobCard job={job} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/20 py-32 text-center">
            <div className="mb-6 rounded-full bg-foreground/5 p-5 text-primary">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              The Vault is Empty
            </h3>
            <p className="mt-3 max-w-sm text-foreground/60 font-light leading-relaxed">
              Our premium collection is currently being curated. Return shortly for new opportunities.
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="relative bg-card/20 border-y border-foreground/5 px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              The HireFlow Advantage
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Elevating the Standard
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-foreground/60 font-light text-lg">
              Experience recruitment redefined. We provide the tools, network, and exclusivity necessary to accelerate your professional journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-background/50 border border-foreground/5 p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:bg-card hover:border-card-border"
              >
                <div className="mb-8 inline-flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-transparent text-primary border border-primary/10 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Testimonials
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Trusted by the Best
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-3xl p-10 relative border border-white/10 dark:border-white/5"
              >
                <div className="absolute -top-3 -left-3 text-primary opacity-20">
                  <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="relative z-10 pt-4">
                  <p className="text-foreground/80 font-light leading-relaxed mb-10 text-lg">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-5">
                    <div className="flex size-12 items-center justify-center rounded-full bg-foreground text-background font-bold shadow-md">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground tracking-wide">{testimonial.name}</h4>
                      <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mt-1">
                        {testimonial.role} <span className="mx-1 text-primary">·</span> {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Luxury Accordion */}
      <section className="relative bg-card/20 border-y border-foreground/5 px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Inquiries
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Common Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {FAQS.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl rounded-[3rem] bg-foreground p-12 text-center sm:p-24 shadow-2xl overflow-hidden"
        >
          {/* Subtle glow inside the dark container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(240,76,36,0.15)_0%,transparent_70%)] pointer-events-none" />

          <h2 className="relative z-10 text-4xl font-extrabold tracking-tight text-background sm:text-6xl mb-8">
            Begin Your Next Chapter.
          </h2>
          <p className="relative z-10 mx-auto max-w-2xl text-background/70 font-light text-lg sm:text-xl mb-12">
            Step into an exclusive ecosystem of industry leaders and unparalleled opportunities. Access is one click away.
          </p>
          {!user ? (
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-12 py-7 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/40 transition-all hover:scale-105"
                >
                  Join Now
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-background/20 px-12 py-7 text-sm font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground"
                >
                  Explore Roles
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-12 py-7 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/40 transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
