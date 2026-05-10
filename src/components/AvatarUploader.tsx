"use client";

import { useRef, useState } from "react";
import Avatar from "./Avatar";

type UploadState = "idle" | "uploading" | "done" | "error";

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  username: string;
  onAvatarChange: (url: string) => Promise<void>;
}

export default function AvatarUploader({
  currentAvatarUrl,
  username,
  onAvatarChange,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation before upload
    if (file.size > 2 * 1024 * 1024) {
      setState("error");
      setErrorMessage("File too large. Maximum size is 2 MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setState("error");
      setErrorMessage("Invalid file type. Allowed: JPEG, PNG, WebP.");
      return;
    }

    // Show local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setState("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error ?? "Upload failed");
      }

      await onAvatarChange(result.url);
      setState("done");
    } catch (err: unknown) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to upload avatar.",
      );
      setPreviewUrl(null);
    }
  };

  const displayUrl = previewUrl ?? currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload avatar image"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={state === "uploading"}
        className="group relative"
        title="Click to upload a new avatar"
      >
        <Avatar
          username={username}
          avatarUrl={displayUrl}
          size="lg"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
      </button>

      {/* State messages */}
      {state === "uploading" && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <div className="w-4 h-4 border-2 border-surface-border border-t-primary rounded-full animate-spin" />
          Uploading...
        </div>
      )}

      {state === "done" && (
        <p className="text-xs text-emerald-400 font-medium">
          Avatar updated.
        </p>
      )}

      {state === "error" && (
        <p className="text-xs text-red-400 font-medium">{errorMessage}</p>
      )}

      <p className="text-xs text-text-muted">
        Click to upload. JPEG, PNG, or WebP. Max 2 MB.
      </p>
    </div>
  );
}
