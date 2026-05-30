import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { russoOne, outfit, manrope } from "@/lib/fonts";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autowner.com"),
  title: {
    template: "%s | AutOwner",
    default: "Repair Cost Checker & OBD Code Lookup", // homepage inherits this when not overridden
  },
  description:
    "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    siteName: "AutOwner",
    type: "website",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description:
      "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
    images: [
      {
        url: "/logo.png",
        width: 1536,
        height: 1024,
        alt: "AutOwner Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repair Cost Checker & OBD Code Lookup | AutOwner",
    description:
      "Check repair costs, decode OBD trouble codes, identify warning lights, and verify mechanic quotes. Free tools for car owners.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.autowner.com",
  },
  verification: {
    google: "ksNIR6fOTCzLYST4OAU_3cdoTqnRtV6dyD3_xTpBt-k",
  },
  other: {
    "msvalidate.01": "F5A564DC037318092ABA3FC1D60E256A",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (!localStorage.getItem('autowner_anonymous_id')) {
                    var id = crypto.randomUUID ? crypto.randomUUID() :
                      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0;
                        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                      });
                    localStorage.setItem('autowner_anonymous_id', id);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${russoOne.variable} ${outfit.variable} ${manrope.variable} bg-surface-0 text-text-primary min-h-screen font-body antialiased relative`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
        <CookieBanner />
        <BackToTop />
      </body>
    </html>
  );
}
