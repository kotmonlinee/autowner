import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_META } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Is Your Mechanic Overcharging? Check Your Repair Quote",
  description:
    "Check if your mechanic's quote is fair. Enter your vehicle details and repair quote to compare against real repair cost data. No login required.",
  alternates: {
    canonical: "https://www.autowner.com/quote-checker",
  },
  openGraph: {
    title: "Is Your Mechanic Overcharging? Check Your Repair Quote",
    description:
      "Check if your mechanic's quote is fair. Compare against real repair cost data.",
    type: "website",
    url: "https://www.autowner.com/quote-checker",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE] },
};

export default function QuoteCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
