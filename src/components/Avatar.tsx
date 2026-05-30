import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-5 h-5 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-16 h-16 text-2xl",
};

const pixelSizes: Record<AvatarSize, number> = {
  sm: 20,
  md: 32,
  lg: 64,
};

interface AvatarProps {
  username?: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
}

export default function Avatar({ username, avatarUrl, size = "md" }: AvatarProps) {
  const initial = (username ?? "?")[0].toUpperCase();
  const px = pixelSizes[size];

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${username ?? "User"}'s avatar`}
        width={px}
        height={px}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 ring-2 ring-surface-border`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-surface-4 flex items-center justify-center font-bold text-text-secondary shrink-0 ring-2 ring-surface-border`}
    >
      {initial}
    </div>
  );
}
