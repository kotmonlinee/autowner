import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is Your Mechanic Overcharging? Check Your Repair Quote — AutOwner",
  description:
    "Check if your mechanic's quote is fair. Enter your vehicle details and repair quote to compare against real repair cost data. No login required.",
  alternates: {
    canonical: "https://www.autowner.com/quote-checker",
  },
  openGraph: {
    title: "Is Your Mechanic Overcharging? Check Your Repair Quote — AutOwner",
    description:
      "Check if your mechanic's quote is fair. Compare against real repair cost data.",
    type: "website",
    url: "https://www.autowner.com/quote-checker",
  },
};

export default function QuoteCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
