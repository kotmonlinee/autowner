import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About AutOwner — Car Aftermarket Community",
  description:
    "Learn about AutOwner, a community built by and for car enthusiasts. Maintenance advice, repair guides, and modification inspiration from ASE-certified mechanics and dedicated DIYers.",
  alternates: {
    canonical: "https://www.autowner.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary font-heading mb-3">
              Our Story
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary font-heading tracking-tight">
              About AutOwner
            </h1>
          </div>

          {/* Intro */}
          <div className="prose-dark space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg text-text-primary font-medium">
              AutOwner was born in a garage — literally. What started as a group
              chat of friends troubleshooting their weekend projects grew into
              something much bigger: a community where anyone who turns a wrench
              can find straight answers, honest advice, and people who get it.
            </p>

            <p>
              We believe every car owner deserves access to reliable
              information, whether you are diagnosing a check-engine light at
              midnight, researching your first brake job, or planning a full
              engine swap. The forums and video platforms out there are packed
              with noise. AutOwner cuts through it.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              What We Do
            </h2>

            <p>
              AutOwner is a focused forum for car maintenance, repair, and
              modification advice. Our content is curated from experienced
              enthusiasts and{" "}
              <strong className="text-text-primary">ASE-certified mechanics</strong>{" "}
              who contribute step-by-step guides, diagnostic walkthroughs, and
              product recommendations backed by real-world experience.
            </p>

            <p>
              We also surface and attribute great discussions from communities
              across the web — giving credit where it is due and bringing the
              best automotive knowledge into one searchable, organized place.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              Built for DIYers
            </h2>

            <p>
              You should not need a dealer service bay to understand your own
              car. Whether you drive a daily commuter, a weekend project, or
              something in between, AutOwner gives you the resources to tackle
              jobs yourself — safely and confidently. We cover everything from
              oil changes and OBD2 code diagnostics to suspension upgrades and
              forced induction builds.
            </p>

            <p>
              Every piece of content is tagged by make, model, and category so
              you can find exactly what applies to your vehicle. No endless
              scrolling. No clickbait. Just useful information.
            </p>

            <h2 className="text-2xl font-bold text-text-primary font-heading mt-10 mb-4">
              Join the Garage
            </h2>

            <p>
              AutOwner is free to use and community-driven. Ask questions, share
              your builds, and help fellow owners keep their cars on the road.
              Sign up, create a profile, and become part of a community that
              treats every garage like a classroom and every car like a project
              worth finishing right.
            </p>
          </div>

          {/* Divider */}
          <hr className="my-12 border-surface-border" />

          {/* Stats/Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-1 border border-surface-border rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary font-display mb-1">
                Community
              </p>
              <p className="text-sm text-text-muted">
                Built by enthusiasts, for enthusiasts
              </p>
            </div>
            <div className="bg-surface-1 border border-surface-border rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary font-display mb-1">
                Expert
              </p>
              <p className="text-sm text-text-muted">
                ASE-certified mechanic contributors
              </p>
            </div>
            <div className="bg-surface-1 border border-surface-border rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary font-display mb-1">
                Free
              </p>
              <p className="text-sm text-text-muted">
                Open access, always
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
