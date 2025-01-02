import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  imageFile: File | null;
}

const ImageUpload = ({ onImageChange, imageFile }: ImageUploadProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <Label htmlFor="image">Product Image</Label>
      <div className="mt-1 flex items-center gap-4">
        {imageFile ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => onImageChange(null)}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="max-w-[200px]"
        />
      </div>
    </div>
  );
};

export default ImageUpload;