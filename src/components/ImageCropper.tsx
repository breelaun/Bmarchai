import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageCropperProps {
  onCropComplete?: (croppedImage: string, crop: Crop) => void;
  aspect?: number;
  bucketName?: string;
  uploadPath?: string;
  maxSize?: number; // in MB
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onCropComplete,
  aspect,
  bucketName = 'images',
  uploadPath = 'uploads',
  maxSize = 5
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isUploading, setIsUploading] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image');
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(file);
    }
  };

  const makeClientCrop = useCallback(async () => {
    if (completedCrop?.width && completedCrop?.height && imgSrc) {
      const croppedImageUrl = await getCroppedImg(
        imgSrc,
        completedCrop,
        'cropped-image.jpeg'
      );
      if (croppedImageUrl && onCropComplete && crop) {
        onCropComplete(croppedImageUrl, crop);
      }
    }
  }, [completedCrop, imgSrc, onCropComplete, crop]);

  const getCroppedImg = (
    imageSrc: string,
    pixelCrop: PixelCrop,
    fileName: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

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

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error('Canvas is empty');
              return;
            }
            resolve(URL.createObjectURL(blob));
          },
          'image/jpeg',
          1
        );
      };
    });
  };

  const uploadToSupabase = async () => {
    if (!completedCrop?.width || !completedCrop?.height || !imgSrc) {
      toast.error('Please crop the image first');
      return;
    }

    try {
      setIsUploading(true);
      const croppedImageUrl = await getCroppedImg(
        imgSrc,
        completedCrop,
        'cropped-image.jpeg'
      );

      // Convert data URL to blob
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], `cropped-${Date.now()}.jpeg`, {
        type: 'image/jpeg',
      });

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`${uploadPath}/${file.name}`, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${uploadPath}/${file.name}`);

      toast.success('Image uploaded successfully');
      return publicUrl;

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
          id="image-input"
        />
        <label
          htmlFor="image-input"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
        >
          Select Image
        </label>
        {imgSrc && (
          <Button 
            onClick={makeClientCrop}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Crop Image
          </Button>
        )}
      </div>

      {imgSrc && (
        <div className="max-w-xl">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              src={imgSrc}
              alt="Crop me"
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>
      )}

      {completedCrop?.width && completedCrop?.height && (
        <Button
          onClick={uploadToSupabase}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Cropped Image'}
        </Button>
      )}
    </div>
  );
};

export default ImageCropper;
