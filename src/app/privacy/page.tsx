import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AutOwner's privacy policy. Learn what data we collect, how we use it, and your rights.",
  alternates: { canonical: "https://www.autowner.com/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description: "Learn what data we collect, how we use it, and your rights.",
    type: "website",
    url: "https://www.autowner.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto px-5 py-16 sm:py-24">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary font-heading mb-3">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-heading tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-text-muted mt-3">
              Last updated: June 8, 2026
            </p>
          </div>

          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              Your privacy matters. This policy explains what information
              AutOwner collects, how we use it, and what rights you have.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              1. Information We Collect
            </h2>

            <p>
              When you create an account, we collect your{" "}
              <strong className="text-text-primary">email address</strong> and
              any profile information you choose to provide. We use Supabase Auth
              for authentication, which stores your email and a hashed password.
              We never see or store your plain-text password.
            </p>

            <p>
              When you use our AI diagnosis tool, we store the symptoms you
              describe and the resulting diagnosis to improve our service and
              avoid redundant AI processing for identical queries.
            </p>

            <p>
              We do not sell, rent, or share your personal information with
              advertisers, data brokers, or any other third parties for marketing
              purposes.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              2. Cookies
            </h2>

            <p>
              AutOwner uses essential cookies to provide core functionality: an
              authentication session token managed by Supabase to keep you signed
              in, and a theme preference cookie to remember your light/dark mode
              setting. These cookies are necessary for the site to function and
              are not used for tracking or advertising.
            </p>

            <p>
              We do not use analytics cookies, tracking pixels, or third-party
              marketing cookies.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              3. Third-Party Services
            </h2>

            <p>
              AutOwner relies on the following services to operate:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-text-primary">Supabase</strong> —
                Provides database, authentication, and backend infrastructure.
                See{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Supabase&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-text-primary">Vercel</strong> — Hosts
                our application and may collect standard server logs for
                performance and security. See{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Vercel&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-text-primary">DeepSeek</strong> —
                Powers our AI symptom checker. Symptom descriptions are sent to
                DeepSeek&apos;s API for analysis. See{" "}
                <a href="https://deepseek.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  DeepSeek&apos;s Privacy Policy
                </a>.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              4. Your Rights
            </h2>

            <p>You have the right to:</p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-text-primary">Access</strong> your
                personal data at any time while logged in.
              </li>
              <li>
                <strong className="text-text-primary">Correct</strong> inaccurate
                information — you can edit your profile and settings.
              </li>
              <li>
                <strong className="text-text-primary">Delete</strong> your
                account and associated data. Contact us and we will remove your
                account promptly.
              </li>
              <li>
                <strong className="text-text-primary">Export</strong> your data
                — contact us and we will provide your personal data in a common
                format.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              5. Data Security
            </h2>

            <p>
              We take reasonable measures to protect your information. Supabase
              encrypts data in transit (TLS) and at rest. Authentication tokens
              are stored securely. However, no online service is 100% secure —
              use a strong, unique password for your account.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              6. Changes to This Policy
            </h2>

            <p>
              We may update this privacy policy from time to time. Material
              changes will be posted on this page with an updated date.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              7. Contact Us
            </h2>

            <p>
              Questions about this policy or your data? Email us at{" "}
              <a href="mailto:privacy@autowner.com" className="text-primary hover:underline">
                privacy@autowner.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
