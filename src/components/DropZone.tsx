"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 20;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please use PNG, JPG, WEBP, or GIF images.";
    }
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File must be under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const err = validateFile(file);
      if (err) {
        setError(err);
        toast.error(err);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="space-y-2">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200
          ${
            isDragOver
              ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/50"
          }
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
        />
        <svg
          className="w-12 h-12 text-neutral-400 dark:text-neutral-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Drop an image here or <span className="text-emerald-600 dark:text-emerald-400">browse</span>
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            PNG, JPG, WEBP, GIF · Max {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
      </label>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
