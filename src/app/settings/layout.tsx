import type { Metadata } from "next";

// Settings is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Account Settings",
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
