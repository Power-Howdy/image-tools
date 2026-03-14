"use client";

import { TOOLS, type ToolId } from "@/tools/types";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  toolTabs: React.ReactNode;
}

export function Layout({
  children,
  activeTool,
  onToolChange,
  toolTabs,
}: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <header className="border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              ImageTools
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Quick image utilities
            </span>
          </div>
          <nav className="mt-4 flex flex-wrap gap-1 overflow-x-auto pb-1 -mb-1">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTool === tool.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {tool.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {toolTabs}
        {children}
      </main>

      <Footer />
    </div>
  );
}
