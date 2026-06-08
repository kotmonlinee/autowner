import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AutOwner. Questions, feedback, or support — we're here to help.",
  alternates: { canonical: "https://www.autowner.com/contact" },
  openGraph: {
    title: "Contact AutOwner",
    description: "Questions, feedback, or support — we're here to help.",
    type: "website",
    url: "https://www.autowner.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto px-5 py-16 sm:py-24">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary font-heading mb-3">
              Get in Touch
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-heading tracking-tight">
              Contact Us
            </h1>
          </div>

          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              Have a question, suggestion, or issue? We&apos;d love to hear from you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 not-prose">
              <div className="bg-surface-1 border border-surface-border rounded-xl p-6">
                <h3 className="text-base font-bold text-text-primary font-heading mb-2">
                  General Inquiries
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  Questions about our tools, partnerships, or anything else.
                </p>
                <a
                  href="mailto:hello@autowner.com"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  hello@autowner.com
                </a>
              </div>

              <div className="bg-surface-1 border border-surface-border rounded-xl p-6">
                <h3 className="text-base font-bold text-text-primary font-heading mb-2">
                  Privacy & Legal
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  Data requests, privacy concerns, or legal questions.
                </p>
                <a
                  href="mailto:privacy@autowner.com"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  privacy@autowner.com
                </a>
              </div>

              <div className="bg-surface-1 border border-surface-border rounded-xl p-6">
                <h3 className="text-base font-bold text-text-primary font-heading mb-2">
                  Feedback
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  Ideas for new features, bug reports, or tool suggestions.
                </p>
                <a
                  href="mailto:hello@autowner.com"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  hello@autowner.com
                </a>
              </div>
            </div>

            <p className="mt-8">
              We typically respond within 24 hours on business days.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
