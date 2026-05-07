import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autowner.com"),
  title: "AutOwner — Car Aftermarket Community",
  description:
    "Find solutions for car maintenance, repair, modification, and more. Join the community of car enthusiasts.",
  openGraph: {
    siteName: "AutOwner",
    type: "website",
    title: "AutOwner — Car Aftermarket Community",
    description:
      "Find solutions for car maintenance, repair, modification, and more. Join the community of car enthusiasts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutOwner — Car Aftermarket Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutOwner — Car Aftermarket Community",
    description:
      "Find solutions for car maintenance, repair, modification, and more. Join the community of car enthusiasts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.autowner.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-0 text-text-primary min-h-screen font-body antialiased relative">
        {children}
      </body>
    </html>
  );
}
