const SITE_NAME = "AutOwner";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

function truncateAtWord(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const clipped = normalized.slice(0, Math.max(1, maxLength - 1)).trimEnd();
  const lastSpace = clipped.lastIndexOf(" ");
  const wordSafe = lastSpace > clipped.length * 0.6 ? clipped.slice(0, lastSpace) : clipped;
  return `${wordSafe.replace(/[\s,;:|\-–—]+$/, "")}…`;
}

/**
 * Build a complete <title> value without passing through the root template.
 * Keeping this in one place prevents duplicate "| AutOwner" suffixes.
 */
export function absoluteSeoTitle(value: string, maxLength = 60): { absolute: string } {
  const contentMax = Math.max(20, maxLength - TITLE_SUFFIX.length);
  return { absolute: `${truncateAtWord(value, contentMax)}${TITLE_SUFFIX}` };
}

export function seoDescription(value: string, maxLength = 160): string {
  return truncateAtWord(value, maxLength);
}

export function vehicleSubjectTitle(
  subject: string,
  vehicle: {
    make?: string | null;
    model?: string | null;
    year?: string | null;
  },
): string {
  const clean = (value: string | null | undefined) => value?.trim() ?? "";
  const make = clean(vehicle.make);
  const model = clean(vehicle.model);
  const year = clean(vehicle.year);
  const vehicleName = [year, make, model].filter(Boolean).join(" ");

  if (!vehicleName || make.toLowerCase() === "unknown") return subject.trim();

  const lowerSubject = subject.toLowerCase();
  const alreadyContextualized =
    lowerSubject.includes(make.toLowerCase()) &&
    (!model || lowerSubject.includes(model.toLowerCase()));

  return alreadyContextualized ? subject.trim() : `${vehicleName}: ${subject.trim()}`;
}
