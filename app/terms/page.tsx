import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms that apply to Stylist Edge Salon website use, service bookings, and appointment management.",
};

const terms = [
  {
    title: "Website use",
    body: "The website is provided to help customers learn about our services, review pricing where available, and submit booking or contact requests. You agree not to misuse the site or interfere with its operation.",
  },
  {
    title: "Appointments and bookings",
    body: "Bookings are subject to availability and salon confirmation. We may contact you to verify appointment details, suggest alternatives, or reschedule when operational changes are necessary.",
  },
  {
    title: "Service information",
    body: "Descriptions, pricing, timing, and availability may change without notice. We aim to keep the menu accurate, but final service details may depend on consultation, hair length, product use, or special requests.",
  },
  {
    title: "Cancellations and no-shows",
    body: "If you need to cancel or change an appointment, please do so as early as possible. Repeated late cancellations or missed appointments may affect future booking access.",
  },
  {
    title: "Limitation of liability",
    body: "Stylist Edge Salon is not responsible for losses caused by circumstances outside our reasonable control, including internet outages, booking interruptions, or events that require temporary service changes.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F1EA] text-text-luxury">
      <header className="sticky top-0 z-30 border-b border-primary/5 bg-[#F7F1EA]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary">
              <img
                src="/logo.png"
                alt="Stylist Edge Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl font-bold tracking-wide group-hover:text-accent transition-colors">
                Stylist Edge Salon
              </span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">
                Terms &amp; Conditions
              </span>
            </div>
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-light"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-20">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Terms of Use
          </p>
          <h1 className="mt-4 font-serif-luxury text-4xl font-bold leading-tight md:text-6xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 text-sm leading-7 text-text-muted md:text-base">
            These terms govern use of the Stylist Edge Salon website and booking
            services. By using the site, you agree to the terms below.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-text-muted">
            Last updated: June 17, 2026
          </p>
        </section>

        <section className="mt-12 grid gap-6">
          {terms.map((term) => (
            <article
              key={term.title}
              className="rounded-3xl border border-primary/5 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="font-serif-luxury text-2xl font-semibold text-primary">
                {term.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-muted md:text-base">
                {term.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-primary/5 bg-primary px-6 py-8 text-white md:px-8">
          <h2 className="font-serif-luxury text-2xl font-semibold text-accent">
            Need help?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            If you need clarification about these terms before booking, contact
            the salon directly and we will help you with the relevant details.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-accent hover:text-accent"
            >
              Home
            </Link>
            <Link
              href="/privacy-policy"
              className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-accent-light"
            >
              Privacy Policy
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
