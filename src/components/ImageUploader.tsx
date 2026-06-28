"use client";

import { useState, useRef, useCallback } from "react";

type UploadState = "idle" | "uploading" | "done" | "error";

interface ImageUploaderProps {
  /** Called with the public URL when upload completes successfully. */
  onChange?: (url: string) => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageUploader({ onChange }: ImageUploaderProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        setState("error");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File too large. Maximum size is 5 MB.");
        setState("error");
        return;
      }

      setState("uploading");
      setError("");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error: errMsg } = await res.json();
          throw new Error(errMsg ?? "Upload failed");
        }

        const { url: uploadedUrl } = await res.json();
        setUrl(uploadedUrl);
        setState("done");
        onChange?.(uploadedUrl);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setState("error");
      }
    },
    [onChange],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    dragCounter.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text
    }
  };

  return (
    <div>
      {/* Drop zone & button */}
      {state !== "done" && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary/70 bg-primary/5"
              : state === "error"
                ? "border-red-500/30 bg-red-500/5"
                : "border-surface-border hover:border-surface-4 bg-surface-1/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {state === "uploading" ? (
            <div className="flex flex-col items-center gap-3 py-2">
              {/* Spinner */}
              <div className="w-8 h-8 border-2 border-surface-border border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-text-muted font-heading">Uploading...</p>
            </div>
          ) : state === "error" ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
               width={32} height={32}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <p className="text-sm text-red-400 font-medium">{error}</p>
              <span className="text-xs text-text-muted mt-1">
                Click to try again
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
               width={32} height={32}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-text-muted font-medium">
                {dragOver
                  ? "Drop your image here"
                  : "Drag & drop an image, or click to browse"}
              </p>
              <span className="text-xs text-text-muted">
                JPEG, PNG, WebP, GIF &mdash; max 5 MB
              </span>
            </div>
          )}
        </div>
      )}

      {/* Done state: preview thumbnail + URL + copy button */}
      {state === "done" && url && (
        <div className="border border-surface-border rounded-xl overflow-hidden bg-surface-1">
          <img
            src={url}
            alt="Uploaded preview"
            width={800}
            height={450}
            className="w-full max-h-48 object-contain bg-surface-0"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div className="p-3 flex items-center gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-1.5 bg-surface-2 text-text-secondary text-xs rounded-lg border border-surface-border font-mono truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all font-heading border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-4"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => {
                setState("idle");
                setUrl("");
                setError("");
              }}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all font-heading bg-surface-2 text-text-muted hover:text-text-secondary border border-surface-border"
            >
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
