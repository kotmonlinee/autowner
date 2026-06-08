import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "mailto:hello@autowner.com" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-1" role="contentinfo">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <NewsletterForm />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Link href="/" className="flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" width="168" height="32" className="h-[32px] w-auto" aria-label="AutOwner">
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb"/>
                    <stop offset="100%" stopColor="#60a5fa"/>
                  </linearGradient>
                </defs>
                <g transform="translate(14, 12) scale(2.333)">
                  <path fill="none" stroke="url(#footer-logo-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/>
                </g>
                <text x="76" y="54" fontFamily="'Russo One','Arial Black',sans-serif" fontSize="40" fill="var(--color-text-primary)">
                  AUT<tspan fill="url(#footer-logo-grad)">O</tspan>WNER
                </text>
              </svg>
            </Link>
            <p className="text-sm text-text-muted mt-1">
            AI-powered car diagnosis, repair costs & OBD code lookup. Know what's wrong with your car.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors font-heading font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-surface-border">
          <p className="text-center text-xs text-text-muted">
            &copy; 2026 AutOwner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
