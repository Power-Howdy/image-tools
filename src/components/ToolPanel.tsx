"use client";

interface ToolPanelProps {
  children: React.ReactNode;
  onDownload: () => void;
  onReset: () => void;
  downloadDisabled?: boolean;
  downloadLabel?: string;
}

export function ToolPanel({
  children,
  onDownload,
  onReset,
  downloadDisabled = false,
  downloadLabel = "Download",
}: ToolPanelProps) {
  return (
    <div className="space-y-6">
      {children}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownload}
          disabled={downloadDisabled}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {downloadLabel}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all active:scale-[0.98]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
