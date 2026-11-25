import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DEFAULT_OG_IMAGE_META } from "@/lib/constants";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import PageHeader from "@/components/content/PageHeader";

export const metadata: Metadata = {
  title: { absolute: "About AutOwner" },
  description:
    "AutOwner helps car owners diagnose problems, estimate repair costs, and make informed decisions — powered by AI and real-world data.",
  alternates: { canonical: "https://www.autowner.com/about" },
  openGraph: {
    title: "About AutOwner",
    description:
      "AI-powered car diagnosis, repair cost estimates, and OBD code lookup. Helping car owners make informed decisions.",
    type: "website",
    url: "https://www.autowner.com/about",
    images: [DEFAULT_OG_IMAGE_META],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <PageHeader
            eyebrow="Our mission"
            title="About AutOwner"
            description="A practical automotive field guide for understanding the fault, the likely repair, the expected cost, and the safest next step."
            aside={
              <div className="border-l-4 border-primary bg-primary/5 p-5">
                <p className="font-display text-3xl font-semibold text-text-primary">Clear answers first.</p>
                <p className="mt-2 text-xs leading-5 text-text-secondary">Structured diagnostic and cost data, with AI-assisted explanations and safety limits stated plainly.</p>
              </div>
            }
          />

          <div className="prose-editorial space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              Every car owner has been there: a warning light comes on, the
              mechanic hands you a quote you don&apos;t understand, and you&apos;re
              left wondering if you&apos;re being overcharged — or if it&apos;s even
              safe to keep driving. AutOwner exists to answer those questions.
            </p>

            <h2 className="mt-10 mb-4 font-display text-3xl font-semibold tracking-[-0.025em] text-text-primary">
              What we do
            </h2>

            <p>
              AutOwner is an AI-powered platform that helps car owners understand
              what&apos;s wrong with their vehicle, what it should cost to fix, and
              what to do next. We combine diagnostic trouble code data, repair cost
              estimates, and AI analysis into tools that are fast, free, and easy
              to use.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 not-prose">
              {[
                {
                  title: "AI Symptom Checker",
                  desc: "Describe what your car is doing and our AI analyzes the symptoms to identify possible causes, related OBD codes, and repair estimates.",
                },
                {
                  title: "OBD-II Code Lookup",
                  desc: "Search over 12,000 diagnostic trouble codes. Get plain-English explanations, common causes, symptoms, and cost estimates.",
                },
                {
                  title: "Repair Cost Estimator",
                  desc: "Browse cost estimates for 55+ common repairs across economy, mid-range, luxury, truck, and European vehicle tiers — with labor vs. parts breakdowns.",
                },
                {
                  title: "Quote Checker",
                  desc: "Paste a mechanic's quote and compare it against real-world cost data. Know if you're getting a fair price before you authorize the work.",
                },
                {
                  title: "Warning Lights Guide",
                  desc: "Identify 50 dashboard warning symbols. Learn what each light means, how urgent it is, and what repairs might cost.",
                },
                {
                  title: "Recall Check",
                  desc: "Search NHTSA safety recalls by make, model, and year. Find out if your vehicle has any open recalls — for free.",
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className="border border-surface-border bg-surface-1 p-5"
                >
                  <h3 className="text-base font-bold text-text-primary font-heading mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 mb-4 font-display text-3xl font-semibold tracking-[-0.025em] text-text-primary">
              Why we built this
            </h2>

            <p>
              The auto repair industry is opaque by design. Most people
              don&apos;t know what a repair should cost, whether a diagnostic code
              is serious, or if they&apos;re being sold work they don&apos;t need.
              We built AutOwner to level the playing field — giving every car
              owner access to the same kind of information that shops and dealers
              use, in a format that actually makes sense.
            </p>

            <p>
              Our AI diagnosis tool is trained to think like an experienced
              mechanic: it considers your symptoms, vehicle details, and common
              failure patterns to give you a starting point before you ever set
              foot in a shop. Combined with our repair cost data, you walk in
              informed — not guessing.
            </p>

            <h2 className="mt-10 mb-4 font-display text-3xl font-semibold tracking-[-0.025em] text-text-primary">
              Free, always
            </h2>

            <p>
              All of our tools are free to use. No paywalls, no subscriptions, no
              credit card required. We believe every car owner deserves access to
              this information, and we&apos;re committed to keeping it that way.
            </p>

            <p>
              Have feedback or ideas? We&apos;d love to hear from you —{" "}
              <a href="/contact" className="text-primary hover:underline">
                get in touch
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
