export interface CropArea {
  x: number; // percent 0-100
  y: number;
  width: number;
  height: number;
}

export async function cropImage(
  file: File,
  crop: CropArea,
  imageWidth: number,
  imageHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const x = (crop.x / 100) * imageWidth;
      const y = (crop.y / 100) * imageHeight;
      const w = (crop.width / 100) * imageWidth;
      const h = (crop.height / 100) * imageHeight;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

      const mime = file.type || "image/png";
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
        mime,
        0.92
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
