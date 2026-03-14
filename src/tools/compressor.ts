import imageCompression from "browser-image-compression";

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  onProgress?: (progress: number) => void;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    quality = 0.8,
    onProgress,
  } = options;

  return imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    initialQuality: quality,
    useWebWorker: true,
    onProgress,
  });
}
