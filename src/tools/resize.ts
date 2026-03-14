export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspect?: boolean;
}

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<Blob> {
  const { width, height, maintainAspect = true } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = width;
      let h = height;

      if (maintainAspect) {
        const aspect = img.width / img.height;
        if (width / height > aspect) {
          w = Math.round(height * aspect);
        } else {
          h = Math.round(width / aspect);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);

      const mime = file.type || "image/png";
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))),
        mime,
        0.92
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
