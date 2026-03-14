"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropEditorProps {
  src: string;
  onCropComplete: (crop: PercentCrop) => void;
}

export function CropEditor({ src, onCropComplete }: CropEditorProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop | undefined>();

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const c = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
        width,
        height
      );
      setCrop(c);
      onCropComplete(c as PercentCrop);
    },
    [onCropComplete]
  );

  return (
    <div className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/50 max-h-[400px] flex items-center justify-center">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => {
          setCrop(percentCrop);
          onCropComplete(percentCrop);
        }}
        onComplete={(_, percentCrop) => onCropComplete(percentCrop)}
        className="max-h-[400px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Crop"
          onLoad={onImageLoad}
          className="max-h-[400px] w-auto object-contain"
        />
      </ReactCrop>
    </div>
  );
}
