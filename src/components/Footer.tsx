import Image from "next/image";
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
              <img
                src="/logo.png"
                alt="AutOwner"
                style={{ height: "36px", width: "auto" }}
              />
            </Link>
            <p className="text-sm text-text-muted mt-1">
              The car aftermarket community. Maintenance, repair, mods & more.
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
