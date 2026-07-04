import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "AutOwner's terms of service. Understand your rights, disclaimers, and limitations of liability.",
  alternates: { canonical: "https://www.autowner.com/terms" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Terms of Service",
    description: "Understand your rights, disclaimers, and limitations of liability.",
    type: "website",
    url: "https://www.autowner.com/terms",
  },
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-text-muted mt-3">
              Last updated: June 8, 2026
            </p>
          </div>

          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              By using AutOwner, you agree to these terms. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using AutOwner, you agree to these Terms of Service.
              If you do not agree, please do not use the site. We may update these
              terms at any time, and continued use after changes constitutes
              acceptance.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              2. Description of Service
            </h2>

            <p>
              AutOwner provides AI-powered car diagnostic tools, OBD-II code
              lookup, repair cost estimates, and related automotive information.
              Our tools are designed to help car owners understand potential issues
              and make more informed decisions — they are not a substitute for
              professional mechanical diagnosis or repair.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              3. Account Registration
            </h2>

            <p>
              Some features may require account registration. You are responsible
              for maintaining the confidentiality of your account credentials and
              for all activity under your account. You agree to provide accurate
              information and to update it as necessary.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              4. AI Diagnosis Disclaimer
            </h2>

            <p>
              Our AI symptom checker provides diagnostic suggestions based on the
              symptoms you describe and general automotive knowledge. It does not
              physically inspect your vehicle. Results are for informational
              reference only and may be incomplete or incorrect. Never rely solely
              on an AI-generated diagnosis to make safety-critical decisions about
              your vehicle.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              5. Not Professional Advice
            </h2>

            <p>
              <strong className="text-text-primary">
                AutOwner does not provide professional mechanic advice.
              </strong>{" "}
              All content on this site — including AI diagnoses, OBD code
              explanations, repair cost estimates, and other information — is
              provided for informational purposes only. Always consult a qualified
              mechanic for an in-person inspection of your specific vehicle.
            </p>

            <p>
              Working on a vehicle can be dangerous. Always follow manufacturer
              guidelines, use proper safety equipment, and consult a professional
              when in doubt. You assume all risk for any work you perform on your
              vehicle based on information found on this site.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              6. Repair Cost Estimates
            </h2>

            <p>
              Our repair cost estimates are based on aggregated data and are
              provided as general reference points. Actual costs vary by location,
              shop rates, vehicle condition, parts availability, and other factors.
              An estimate on AutOwner is not a quote or guarantee of what your
              repair will cost.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              7. Limitation of Liability
            </h2>

            <p>
              To the fullest extent permitted by law, AutOwner and its operators
              shall not be liable for any direct, indirect, incidental, special, or
              consequential damages resulting from:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>Your use of or inability to use the site.</li>
              <li>
                Decisions or actions you take based on information found on the
                site.
              </li>
              <li>
                Damage to your vehicle, property, or person arising from
                maintenance, repair, or diagnostic decisions.
              </li>
            </ul>

            <p>
              AutOwner is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis without warranties of any kind.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              8. Account Termination
            </h2>

            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms. You may delete your account at any time by contacting
              us.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              9. Governing Law
            </h2>

            <p>
              These Terms shall be governed by the laws of the United States,
              without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              10. Contact
            </h2>

            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:legal@autowner.com" className="text-primary hover:underline">
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
