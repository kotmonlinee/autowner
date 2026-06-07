// Warning light icons loaded from public/warning-lights/{slug}.svg
// Falls back to a generic warning triangle if the SVG file is missing

const severityColors = {
  critical: { stroke: "text-red-500", bg: "bg-red-100 dark:bg-red-950/40", ring: "ring-red-200 dark:ring-red-900/30" },
  caution: { stroke: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40", ring: "ring-amber-200 dark:ring-amber-900/30" },
  informational: { stroke: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40", ring: "ring-emerald-200 dark:ring-emerald-900/30" },
};

export default function WarningLightIcon({ slug, size = 48, severity, className }: {
  slug: string; size?: number; severity?: string; className?: string;
}) {
  const colors = severityColors[severity as keyof typeof severityColors] ?? severityColors.caution;
  return (
    <span className={`inline-flex items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.ring} shrink-0 ${className ?? ""}`} style={{ width: size + 8, height: size + 8 }}>
      <img
        src={`/warning-lights/${slug}.svg`}
        alt=""
        width={size - 8}
        height={size - 8}
        className={colors.stroke}
        onError={(e) => {
          // Fallback: show generic warning triangle
          e.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}
