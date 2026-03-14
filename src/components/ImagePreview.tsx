"use client";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface ImagePreviewProps {
  originalUrl: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  resultUrl?: string | null;
  resultSize?: number;
  resultWidth?: number;
  resultHeight?: number;
  loading?: boolean;
  progress?: number | null;
}

export function ImagePreview({
  originalUrl,
  originalSize,
  originalWidth,
  originalHeight,
  resultUrl,
  resultSize,
  resultWidth,
  resultHeight,
  loading,
  progress = null,
}: ImagePreviewProps) {
  const origDim =
    originalWidth && originalHeight
      ? `${originalWidth}×${originalHeight}`
      : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/50 p-4 shadow-sm">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Original
        </p>
        <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800/50 overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original"
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
            {formatSize(originalSize)}
          </span>
          {origDim && (
            <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
              {origDim}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/50 p-4 shadow-sm">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Result
        </p>
        <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800/50 overflow-hidden flex items-center justify-center">
          {loading ? (
            <div className="w-full max-w-[200px] flex flex-col items-center gap-2 px-4">
              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                  style={
                    progress != null
                      ? { width: `${progress}%` }
                      : {
                          width: "40%",
                          animation:
                            "progress-indeterminate 1.5s ease-in-out infinite",
                        }
                  }
                />
              </div>
              <span className="text-xs text-neutral-500">
                Processing…{progress != null ? ` ${progress}%` : ""}
              </span>
            </div>
          ) : resultUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Result"
                className="max-w-full max-h-full object-contain"
              />
            </>
          ) : (
            <span className="text-sm text-neutral-400">—</span>
          )}
        </div>
        {resultUrl && !loading && (
          <div className="mt-2 flex gap-2">
            {resultSize != null && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
                {formatSize(resultSize)}
              </span>
            )}
            {resultWidth != null && resultHeight != null && (
              <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                {resultWidth}×{resultHeight}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
