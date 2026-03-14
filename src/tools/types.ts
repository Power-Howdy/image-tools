export type ToolId =
  | "compressor"
  | "base64"
  | "png-to-jpg"
  | "background-remover"
  | "resize"
  | "crop"
  | "webp-to-png";

export interface ToolConfig {
  id: ToolId;
  label: string;
  description: string;
}

export const TOOLS: ToolConfig[] = [
  { id: "compressor", label: "Compress", description: "Reduce file size" },
  { id: "base64", label: "Base64", description: "Encode to base64" },
  { id: "png-to-jpg", label: "PNG → JPG", description: "Convert PNG to JPG" },
  {
    id: "background-remover",
    label: "Remove BG",
    description: "Remove background",
  },
  { id: "resize", label: "Resize", description: "Resize dimensions" },
  { id: "crop", label: "Crop", description: "Crop image" },
  { id: "webp-to-png", label: "WEBP → PNG", description: "Convert WEBP to PNG" },
];
