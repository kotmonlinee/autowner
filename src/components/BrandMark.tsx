export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" fill="#f4f0e8" />
      <rect x="4" y="4" width="56" height="56" fill="#141617" />
      <path
        d="M11 35h10l5-16 9 27 6-15h12"
        fill="none"
        stroke="#fffdf8"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="43" y="12" width="10" height="5" fill="#e6531d" />
    </svg>
  );
}
