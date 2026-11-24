import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AutOwner's privacy policy. Learn what data we collect, how we use it, and your rights.",
  alternates: { canonical: "https://www.autowner.com/privacy" },
  robots: { index: false, follow: true },
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
              Last updated: November 24, 2026
            </p>
          </div>

          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              Your privacy matters. This policy explains what information
              AutOwner collects, how we use it, how cookies and advertising may
              affect you, and what rights you have.
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
              avoid redundant AI processing for identical queries. Do not enter
              names, contact details, license plate numbers, VINs, or other
              sensitive personal information in symptom descriptions.
            </p>

            <p>
              We collect limited usage and device information when you use the
              site. Depending on the services loaded and your choices, this may
              include pages viewed, actions taken, approximate location derived
              from network information, browser and device type, referring pages,
              and an anonymous identifier stored in your browser. We use this
              information to measure site performance, understand which tools are
              useful, prevent abuse, and improve content.
            </p>

            <p>
              We do not sell your account or contact information for monetary
              consideration. Third-party analytics and advertising providers may
              process device and usage information as described in this policy.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              2. Cookies and Similar Technologies
            </h2>

            <p>
              AutOwner and third-party services use cookies, local storage, pixels,
              and similar technologies for several purposes.
            </p>

            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong className="text-text-primary">Essential:</strong>{" "}
                Authentication sessions, security controls, cookie preferences,
                theme choice, and anonymous identifiers needed to provide site
                functionality.
              </li>
              <li>
                <strong className="text-text-primary">Analytics:</strong>{" "}
                Google Analytics 4, Microsoft Clarity, Vercel Analytics, and our
                internal event system help us understand page usage, tool
                performance, errors, and user experience.
              </li>
              <li>
                <strong className="text-text-primary">Advertising:</strong> If
                advertising is enabled, Google AdSense and its partners may use
                cookies or similar technologies to measure advertising and
                provide personalized or non-personalized ads.
              </li>
            </ul>

            <p>
              Our cookie banner records your selection in your browser. You can
              also block or delete cookies through your browser settings and use
              the advertising-industry opt-out tools described below. Blocking
              essential cookies may prevent sign-in, saved preferences, or other
              features from working.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              3. How We Use Information
            </h2>

            <p>
              We use information to operate and secure the site, provide
              diagnostic and repair-cost tools, remember preferences, respond to
              requests, understand aggregate traffic, fix errors, improve content,
              prevent abuse, and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              4. Third-Party Services
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
                our application, provides privacy-focused traffic analytics, and
                may collect standard server logs for performance and security. See{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Vercel&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-text-primary">Google Analytics</strong> —
                Provides aggregate usage analytics. See{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-text-primary">Microsoft Clarity</strong> —
                Provides anonymized interaction and usability analytics. See{" "}
                <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Microsoft&apos;s Privacy Statement
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
              5. Advertising and Google AdSense
            </h2>

            <p>
              If we enable Google AdSense or other third-party advertising,
              third-party vendors, including Google, may use cookies to serve ads
              based on your prior visits to this website or other websites.
              Google&apos;s use of advertising cookies enables it and its partners
              to serve ads based on your visits to this site and/or other sites on
              the Internet.
            </p>

            <p>
              You may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Ads Settings
              </a>
              . You can also opt out of some third-party vendors&apos; use of
              cookies for personalized advertising by visiting{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                AboutAds
              </a>
              .
            </p>

            <p>
              Advertising partners may receive information such as cookie
              identifiers, IP-derived approximate location, device information,
              and ad interaction data. Their handling of that information is
              governed by their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              6. Your Rights and Choices
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
              <li>
                <strong className="text-text-primary">Opt out of personalized ads</strong>
                {" "}through the advertising choices described above.
              </li>
              <li>
                <strong className="text-text-primary">Manage cookies</strong>
                {" "}through the site banner and your browser settings.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              7. Data Retention
            </h2>

            <p>
              We retain account information while your account is active, stored
              diagnoses and anonymous usage information for service improvement
              and abuse prevention, and server logs for the period required by our
              providers or applicable law. Retention periods vary by data type and
              operational need.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              8. Data Security
            </h2>

            <p>
              We take reasonable measures to protect your information. Supabase
              encrypts data in transit (TLS) and at rest. Authentication tokens
              are stored securely. However, no online service is 100% secure —
              use a strong, unique password for your account.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              9. Children
            </h2>

            <p>
              AutOwner is not directed to children under 13, and we do not
              knowingly collect personal information from children under 13. If
              you believe a child has provided personal information, contact us
              so we can remove it.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              10. Changes to This Policy
            </h2>

            <p>
              We may update this privacy policy from time to time. Material
              changes will be posted on this page with an updated date.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              11. Contact Us
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
