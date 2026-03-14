export async function removeBackground(
  file: File,
  onProgress?: (key: string, current: number, total: number) => void
): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(URL.createObjectURL(file), {
    progress: onProgress
      ? (key: string, current: number, total: number) => {
          onProgress(key, current, total);
        }
      : undefined,
  });
  return blob;
}
