import type { Metadata } from "next";

// The submit form is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Submit a Post",
  robots: { index: false, follow: true },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
