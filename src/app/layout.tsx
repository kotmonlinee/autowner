import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { russoOne, outfit, manrope } from "@/lib/fonts";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autowner.com"),
  title: {
    template: "%s | AutOwner",
    default: "AutOwner — What's Wrong with Your Car?",
  },
  description:
    "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification. Know what's wrong with your car and what it should cost to fix.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: "AutOwner",
    type: "website",
    title: "AutOwner — What's Wrong with Your Car?",
    description:
      "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification. Know what's wrong and what it should cost.",
    images: [
      {
        url: "/logo.svg",
        width: 500,
        height: 100,
        alt: "AutOwner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutOwner — What's Wrong with Your Car?",
    description:
      "AI-powered car diagnosis, OBD-II code lookup, repair cost estimates, and mechanic quote verification.",
    images: ["/logo.svg"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"AutOwner","url":"https://www.autowner.com","logo":"https://www.autowner.com/icon-512.svg"}) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"WebSite","url":"https://www.autowner.com","potentialAction":{"@type":"SearchAction","target":"https://www.autowner.com/search?q={search_term_string}","query-input":"required name=search_term_string"}}) }} />
        {/* Critical inline styles — prevent FOUC when CSS chunk is delayed */}
        <style dangerouslySetInnerHTML={{ __html: `
          html,body{margin:0;padding:0;background:#f8f9fa;color:#1a1a2e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
          .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
          .min-h-screen{min-height:100vh}
          .flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}
          @keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
        `}} />
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T2QR8THDJ3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-T2QR8THDJ3');`}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x93ijgbz2j");`}
        </Script>
        <CookieBanner />
        <BackToTop />
      </body>
    </html>
  );
}
