import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Stylist Edge Salon collects, uses, and protects your personal information when you browse the site or make a booking.",
};

const sections = [
  {
    title: "Information we collect",
    body: "We may collect details you share directly with us, such as your name, phone number, appointment preferences, and any message you send when booking or contacting the salon.",
  },
  {
    title: "How we use it",
    body: "We use your information to confirm bookings, manage appointment requests, respond to questions, improve our services, and maintain accurate salon records.",
  },
  {
    title: "Sharing and storage",
    body: "We do not sell your personal information. We may share it only with trusted service providers or where required to operate the website, process bookings, or comply with legal obligations.",
  },
  {
    title: "Your choices",
    body: "You may request updates or removal of your contact information by reaching out to the salon. We will make reasonable efforts to respond to privacy-related requests promptly.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-luxury text-text-luxury">
      <header className="sticky top-0 z-30 border-b border-primary/5 bg-bg-luxury/90 backdrop-blur-md">
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
                Privacy Policy
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
            Privacy Notice
          </p>
          <h1 className="mt-4 font-serif-luxury text-4xl font-bold leading-tight md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-sm leading-7 text-text-muted md:text-base">
            This policy explains how Stylist Edge Salon handles information
            collected through our website, booking forms, and customer
            communications.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-text-muted">
            Last updated: June 17, 2026
          </p>
        </section>

        <section className="mt-12 grid gap-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-primary/5 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="font-serif-luxury text-2xl font-semibold text-primary">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-muted md:text-base">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-primary/5 bg-primary px-6 py-8 text-white md:px-8">
          <h2 className="font-serif-luxury text-2xl font-semibold text-accent">
            Contact us
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            If you have questions about this policy or want to update your
            details, please contact the salon through our booking or contact
            channels.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-accent hover:text-accent"
            >
              Home
            </Link>
            <Link
              href="/terms"
              className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-accent-light"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
