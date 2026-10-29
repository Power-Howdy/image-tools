import model2x from "@upscalerjs/esrgan-slim/2x";
import model3x from "@upscalerjs/esrgan-slim/3x";
import model4x from "@upscalerjs/esrgan-slim/4x";

type UpscaleScale = 2 | 3 | 4;

const MODEL_BY_SCALE = {
  2: model2x,
  3: model3x,
  4: model4x,
} as const;

// Cache one Upscaler instance per scale so the model isn't reloaded on every call
const upscalerCache = new Map<UpscaleScale, Promise<any>>();

async function getUpscaler(scale: UpscaleScale) {
  if (!upscalerCache.has(scale)) {
    upscalerCache.set(
      scale,
      (async () => {
        await import("@tensorflow/tfjs");
        const { default: Upscaler } = await import("upscaler");
        return new Upscaler({ model: MODEL_BY_SCALE[scale] });
      })()
    );
  }
  return upscalerCache.get(scale)!;
}

export async function upscaleImage(
  file: File,
  onProgress?: (key: string, current: number, total: number) => void,
  scale: UpscaleScale = 2
): Promise<Blob> {
  const upscaler = await getUpscaler(scale);
  const objectUrl = URL.createObjectURL(file);

  try {
    const dataUrl: string = await upscaler.upscale(objectUrl, {
      // Process in tiles to avoid running out of GPU/RAM on large images
      patchSize: 64,

      padding: 2,
      progress: onProgress
        ? (amount: number) => {
            onProgress("upscale", Math.round(amount * 100), 100);
          }
        : undefined,
    });

    // Upscaler returns a base64 data URL; convert to Blob to match removeBackground
    const res = await fetch(dataUrl);
    return await res.blob();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}


