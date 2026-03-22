"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Layout } from "./Layout";
import { DropZone } from "./DropZone";
import { ImagePreview } from "./ImagePreview";
import { ToolPanel } from "./ToolPanel";
import { CropEditor } from "./CropEditor";
import {
  TOOLS,
  type ToolId,
} from "@/tools/types";
import { imageToBase64 } from "@/tools/base64";
import { pngToJpg } from "@/tools/pngToJpg";
import { webpToPng } from "@/tools/webpToPng";
import { resizeImage } from "@/tools/resize";
import { compressImage } from "@/tools/compressor";
import { removeBackground } from "@/tools/backgroundRemover";
import { cropImage } from "@/tools/crop";
import type { PercentCrop } from "react-image-crop";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type ToolState = {
  file: File;
  originalUrl: string;
  originalWidth?: number;
  originalHeight?: number;
  resultBlob: Blob | null;
  resultBase64?: string;
  loading: boolean;
  error: string | null;
  progress: number | null;
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export function ImageToolsClient() {
  const [activeTool, setActiveTool] = useState<ToolId>("compressor");
  const [state, setState] = useState<ToolState | null>(null);
  const [resizeWidth, setResizeWidth] = useState(DEFAULT_WIDTH);
  const [resizeHeight, setResizeHeight] = useState(DEFAULT_HEIGHT);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [compressQuality, setCompressQuality] = useState(0.8);
  const [cropArea, setCropArea] = useState<PercentCrop | null>(null);

  const getImageDimensions = useCallback(
    (file: File): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
          URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const processFile = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      let dims: { width: number; height: number } | undefined;
      try {
        dims = await getImageDimensions(file);
      } catch {
        dims = undefined;
      }

      const hasProgress =
        activeTool === "compressor" || activeTool === "background-remover";
      setState({
        file,
        originalUrl: url,
        originalWidth: dims?.width,
        originalHeight: dims?.height,
        resultBlob: null,
        resultBase64: undefined,
        loading: true,
        error: null,
        progress: hasProgress ? 0 : null,
      });
      setCropArea(null);

      try {
        let resultBlob: Blob | null = null;
        let resultBase64: string | undefined;

        switch (activeTool) {
          case "base64": {
            resultBase64 = await imageToBase64(file);
            break;
          }
          case "png-to-jpg": {
            resultBlob = await pngToJpg(file);
            break;
          }
          case "webp-to-png": {
            resultBlob = await webpToPng(file);
            break;
          }
          case "resize": {
            resultBlob = await resizeImage(file, {
              width: resizeWidth,
              height: resizeHeight,
              maintainAspect,
            });
            break;
          }
          case "compressor": {
            const compressed = await compressImage(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              quality: compressQuality,
              onProgress: (p) =>
                setState((s) => (s ? { ...s, progress: p } : null)),
            });
            resultBlob = compressed;
            break;
          }
          case "background-remover": {
            resultBlob = await removeBackground(file, (key, current, total) => {
              const p = total > 0 ? Math.round((current / total) * 100) : 0;
              setState((s) => (s ? { ...s, progress: p } : null));
            });
            break;
          }
          case "crop": {
            if (cropArea && cropArea.width > 0 && cropArea.height > 0 && dims) {
              resultBlob = await cropImage(
                file,
                {
                  x: cropArea.x,
                  y: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                },
                dims.width,
                dims.height
              );
            }
            break;
          }
        }

        setState((s) =>
          s
            ? {
                ...s,
                resultBlob,
                resultBase64,
                loading: false,
                error: null,
                progress: null,
              }
            : null
        );
        const toolLabels: Record<ToolId, string> = {
          compressor: "Compressed",
          resize: "Resize complete",
          crop: "Crop complete",
          "background-remover": "Background removed",
          base64: "Base64 encoded",
          "png-to-jpg": "Converted to JPG",
          "webp-to-png": "Converted to PNG",
        };
        const label = toolLabels[activeTool];
        if (resultBlob || resultBase64) {
          if (activeTool === "compressor" && resultBlob) {
            toast.success(
              `${label}: ${formatSize(file.size)} → ${formatSize(resultBlob.size)}`
            );
          } else {
            toast.success(label);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Processing failed";
        setState((s) =>
          s
            ? {
                ...s,
                loading: false,
                error: msg,
                progress: null,
              }
            : null
        );
        toast.error(msg);
      }
    },
    [
      activeTool,
      getImageDimensions,
      resizeWidth,
      resizeHeight,
      maintainAspect,
      compressQuality,
      cropArea,
    ]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      setCropArea(null);
      processFile(file);
    },
    [processFile]
  );

  useEffect(() => {
    // Clear image when switching tools so user must re-upload
    if (state) {
      if (state.originalUrl) URL.revokeObjectURL(state.originalUrl);
      setState(null);
      setCropArea(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool]);

  const handleCropApply = useCallback(() => {
    if (state?.file && cropArea && cropArea.width > 0 && cropArea.height > 0) {
      processFile(state.file);
    }
  }, [state?.file, cropArea, processFile]);

  const handleDownload = useCallback(async () => {
    if (!state) return;
    if (state.resultBase64) {
      try {
        await navigator.clipboard.writeText(state.resultBase64);
        toast.success("Copied to clipboard");
      } catch {
        const a = document.createElement("a");
        a.href = state.resultBase64;
        a.download = "image-base64.txt";
        a.click();
        toast.success("Downloaded as image-base64.txt");
      }
      return;
    }
    if (state.resultBlob) {
      const ext =
        activeTool === "png-to-jpg"
          ? "jpg"
          : activeTool === "webp-to-png" || activeTool === "background-remover"
            ? "png"
            : state.file.name.split(".").pop() || "png";
      const url = URL.createObjectURL(state.resultBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `output.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Image downloaded");
    }
  }, [state, activeTool]);

  const handleReset = useCallback(() => {
    if (state?.originalUrl) URL.revokeObjectURL(state.originalUrl);
    setState(null);
    setCropArea(null);
    toast("Image cleared");
  }, [state?.originalUrl]);

  const blobUrlRef = useRef<string | null>(null);
  const lastBlobRef = useRef<Blob | null>(null);

  if (state?.resultBase64) {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
      lastBlobRef.current = null;
    }
  } else if (state?.resultBlob && state.resultBlob !== lastBlobRef.current) {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = URL.createObjectURL(state.resultBlob);
    lastBlobRef.current = state.resultBlob;
  }

  const resultUrl =
    state?.resultBase64 ?? (state?.resultBlob ? blobUrlRef.current : null);

  useEffect(
    () => () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    },
    []
  );

  const resultSize = state?.resultBlob?.size;
  let resultWidth: number | undefined;
  let resultHeight: number | undefined;
  if (state?.resultBlob && !state.resultBase64) {
    // Could read from blob for dimensions - skip for now, ImagePreview handles optional
  }

  const toolDesc = TOOLS.find((t) => t.id === activeTool);

  return (
    <Layout activeTool={activeTool} onToolChange={setActiveTool} toolTabs={null}>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {toolDesc?.label}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {toolDesc?.description}
          </p>
        </div>

        {!state ? (
          <DropZone onFileSelect={handleFileSelect} />
        ) : (
          <ToolPanel
            onDownload={handleDownload}
            onReset={handleReset}
            downloadDisabled={!state.resultBlob && !state.resultBase64}
            downloadLabel={activeTool === "base64" ? "Copy Base64" : "Download"}
          >
            {/* Tool-specific controls */}
            {activeTool === "resize" && (
              <div className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/50 p-4 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => setResizeWidth(Number(e.target.value) || 1)}
                      min={1}
                      max={8000}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(Number(e.target.value) || 1)}
                      min={1}
                      max={8000}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded border-neutral-400"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Maintain aspect ratio
                  </span>
                </label>
                <button
                  onClick={() => processFile(state.file)}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Apply
                </button>
              </div>
            )}

            {activeTool === "compressor" && (
              <div className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/50 p-4 shadow-sm space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Quality: {Math.round(compressQuality * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => processFile(state.file)}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Apply
                </button>
              </div>
            )}

            {activeTool === "crop" && !state.resultBlob && (
              <div className="space-y-3">
                <CropEditor
                  src={state.originalUrl}
                  onCropComplete={(c) => setCropArea(c)}
                />
                <button
                  onClick={handleCropApply}
                  disabled={!cropArea || cropArea.width <= 0 || cropArea.height <= 0}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                >
                  Apply crop
                </button>
              </div>
            )}

            {state.error && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {state.error}
              </p>
            )}

            {((activeTool !== "crop") || state.resultBlob) && (
              <ImagePreview
                originalUrl={state.originalUrl}
                originalSize={state.file.size}
                originalWidth={state.originalWidth}
                originalHeight={state.originalHeight}
                resultUrl={resultUrl}
                resultSize={resultSize}
                resultWidth={resultWidth}
                resultHeight={resultHeight}
                loading={state.loading}
                progress={state.progress}
              />
            )}
          </ToolPanel>
        )}
      </div>
    </Layout>
  );
}
