import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function AuthBrand() {
  return (
    <Link href="/" prefetch={false} className="inline-flex items-center gap-2.5" aria-label="AutOwner home">
      <BrandMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-2xl font-semibold tracking-[-0.035em] text-text-primary">AutOwner</span>
    </Link>
  );
}
