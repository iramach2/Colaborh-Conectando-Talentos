import { ChangeEvent, useRef, useState } from 'react';

export type CropPoint = {
  x: number;
  y: number;
};

export type PixelCrop = CropPoint & {
  width: number;
  height: number;
};

const getCroppedImg = async (imageSrc: string, pixelCrop: PixelCrop): Promise<string | null> => {
  const image = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

export const useCandidateProfilePhotoCrop = (onProfilePicChange: (imageDataUrl: string) => void) => {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);

  const onCropComplete = (_croppedArea: PixelCrop, nextCroppedAreaPixels: PixelCrop) => {
    setCroppedAreaPixels(nextCroppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        onProfilePicChange(croppedImage);
      }
      setImageToCrop(null);
    }
  };

  const handleProfilePicSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('O tamanho maximo da imagem permitido e 2MB. Por favor, selecione um arquivo menor.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return {
    imageToCrop,
    setImageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    profilePicRef,
    onCropComplete,
    handleApplyCrop,
    handleProfilePicSelect,
  };
};
