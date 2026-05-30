import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AutOwner's privacy policy. Learn what data we collect, how we use cookies, and your rights regarding your personal information.",
  alternates: {
    canonical: "https://www.autowner.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-4xl mx-auto px-5 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary font-heading mb-3">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-heading tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-text-muted mt-3">
              Last updated: May 5, 2026
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
              When you create an account on AutOwner, we collect your{" "}
              <strong className="text-text-primary">email address</strong> and
              any profile information you choose to provide (such as a display
              name or avatar). We use Supabase Auth for authentication, which
              stores your email and a hashed password. We never see or store
              your plain-text password.
            </p>

            <p>
              When you interact with the site — posting, commenting, voting, or
              bookmarking — we store that content and the associated metadata
              (timestamp, author ID) in our database. This is necessary to
              provide the forum functionality.
            </p>

            <p>
              We do not sell, rent, or share your personal information with
              advertisers, data brokers, or any other third parties for
              marketing purposes.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              2. Cookies
            </h2>

            <p>
              AutOwner uses a single essential cookie managed by Supabase: an
              authentication session token. This cookie is necessary for keeping
              you signed in across pages. It does not track you across other
              websites and is not used for advertising.
            </p>

            <p>
              We do not use analytics cookies, tracking pixels, or third-party
              marketing cookies. If this changes in the future, we will update
              this policy and provide notice.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              3. Third-Party Services
            </h2>

            <p>
              AutOwner relies on the following third-party services to operate:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-text-primary">Supabase</strong> —{" "}
                Provides our database, authentication, and backend
                infrastructure. Supabase stores your account information, posts,
                comments, and votes. See{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Supabase's Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-text-primary">Vercel</strong> — Hosts
                our application and may collect standard server logs (IP
                addresses, request timestamps) for performance and security
                purposes. See{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel's Privacy Policy
                </a>
                .
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              4. Your Rights
            </h2>

            <p>
              You have the right to:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-text-primary">Access</strong> your
                personal data — you can view your profile and posts at any time
                while logged in.
              </li>
              <li>
                <strong className="text-text-primary">Correct</strong>{" "}
                inaccurate information — you can edit your profile and your
                posts.
              </li>
              <li>
                <strong className="text-text-primary">Delete</strong> your
                account and associated data — contact us and we will remove your
                account and personal information. Some content you contributed
                (posts, comments) may be anonymized and retained for the
                continuity of discussions.
              </li>
              <li>
                <strong className="text-text-primary">Export</strong> your data
                — contact us and we will provide a copy of your personal data in
                a common format.
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
              6. Children's Privacy
            </h2>

            <p>
              AutOwner is not directed at children under 13, and we do not
              knowingly collect information from anyone under 13. If you believe
              a child has provided us with personal data, please contact us
              immediately.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              7. Changes to This Policy
            </h2>

            <p>
              We may update this privacy policy from time to time. Material
              changes will be posted on this page with an updated date. We
              encourage you to review this policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              8. Contact Us
            </h2>

            <p>
              If you have questions about this privacy policy, your data, or
              would like to exercise your rights, email us at{" "}
              <a
                href="mailto:privacy@autowner.com"
                className="text-primary hover:underline"
              >
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
