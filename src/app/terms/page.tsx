import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — AutOwner",
  description:
    "AutOwner's terms of service. Understand your rights, user conduct expectations, content ownership, and disclaimers.",
  alternates: {
    canonical: "https://www.autowner.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary font-heading mb-3">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-heading tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-text-muted mt-3">
              Last updated: May 5, 2026
            </p>
          </div>

          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              Welcome to AutOwner. By using this site, you agree to these terms.
              Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using AutOwner (the "Site"), you agree to be bound
              by these Terms of Service. If you do not agree, please do not use
              the Site. We reserve the right to update these terms at any time,
              and continued use of the Site after changes constitutes acceptance
              of the updated terms.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              2. User Conduct
            </h2>

            <p>
              AutOwner is a community built on respect and shared passion for
              cars. When using the Site, you agree not to:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                Post spam, irrelevant promotional content, or malicious links.
              </li>
              <li>
                Harass, threaten, or personally attack other users.
              </li>
              <li>
                Post illegal content or content that infringes on intellectual
                property rights.
              </li>
              <li>
                Impersonate others or misrepresent your affiliation with any
                person or organization.
              </li>
              <li>
                Attempt to compromise the security or functionality of the Site.
              </li>
            </ul>

            <p>
              We reserve the right to remove content and suspend or terminate
              accounts that violate these standards, at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              3. Content Ownership
            </h2>

            <p>
              <strong className="text-text-primary">
                You own the content you post.
              </strong>{" "}
              When you create a post, comment, or upload media on AutOwner, you
              retain all ownership rights to that content. By posting, you grant
              AutOwner a non-exclusive, royalty-free license to display and
              distribute your content on the Site for the purpose of operating
              the forum.
            </p>

            <p>
              You are responsible for the content you post. Do not post content
              you do not have the right to share. If you believe someone has
              posted content that infringes your rights, contact us.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              4. Scraped and Third-Party Content
            </h2>

            <p>
              AutOwner aggregates and republishes automotive discussions from
              public forums (including Reddit) using automated scraping tools.
              This content is:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                Clearly <strong className="text-text-primary">attributed</strong>{" "}
                to its original source with a link back to the original
                discussion.
              </li>
              <li>
                Used for{" "}
                <strong className="text-text-primary">discussion</strong> and
                educational purposes — not passed off as our original work.
              </li>
              <li>
                Scraped from publicly available posts. If you are the original
                author and want your content removed from AutOwner, contact us
                and we will take it down promptly.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              5. Disclaimer — Not Professional Advice
            </h2>

            <p>
              <strong className="text-text-primary">
                AutOwner is not a substitute for professional mechanic advice.
              </strong>{" "}
              The content on this Site — including posts, comments, guides, and
              recommendations — is provided for informational and discussion
              purposes only. While we feature contributions from ASE-certified
              mechanics, no content on this Site constitutes professional
              automotive diagnosis or repair advice for your specific vehicle.
            </p>

            <p>
              Working on a vehicle can be dangerous. Always follow manufacturer
              guidelines, use proper safety equipment, and consult a qualified
              mechanic when in doubt. You assume all risk for any work you
              perform on your vehicle based on information found on this Site.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              6. Limitation of Liability
            </h2>

            <p>
              To the fullest extent permitted by law, AutOwner and its
              operators, contributors, and affiliates shall not be liable for
              any direct, indirect, incidental, special, or consequential
              damages resulting from:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>Your use of or inability to use the Site.</li>
              <li>
                Any actions you take (or refrain from taking) based on
                information found on the Site.
              </li>
              <li>
                Damage to your vehicle, property, or person arising from
                maintenance, repair, or modification work.
              </li>
              <li>
                Unauthorized access to or alteration of your data.
              </li>
            </ul>

            <p>
              AutOwner is provided on an "as is" and "as available" basis
              without warranties of any kind, either express or implied.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              7. Account Termination
            </h2>

            <p>
              We reserve the right to suspend or terminate your account and
              access to the Site at any time, for any reason, including but not
              limited to violation of these Terms. You may also delete your
              account at any time by contacting us.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              8. Governing Law
            </h2>

            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to conflict of law
              principles.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              9. Contact
            </h2>

            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:legal@autowner.com"
                className="text-primary hover:underline"
              >
                legal@autowner.com
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
