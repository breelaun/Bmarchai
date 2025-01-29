import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import type { ProductFile } from "../types";

interface ProductFileUploadProps {
  onFilesChange: (files: ProductFile[]) => void;
  files: ProductFile[];
}

const ProductFileUpload = ({ onFilesChange, files }: ProductFileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        type: file.type
      }));
      
      if (files.length + newFiles.length <= 10) {
        onFilesChange([...files, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <Label>Product Files (Max 10)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="text-sm truncate">{file.file.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => removeFile(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {files.length < 10 && (
          <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
            <Input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="product-files"
              multiple
              accept=".cbr,.pdf,.mobi,.azw,.djvu,.kindle,.txt,.epub,.doc,.docx,.jpeg,.jpg,.png,.wav,.mp4,.ogg,.rss,.wma,.aiff,.flac,.avi,.webm,.mkv,.hevc,.mpeg2,.flv,.avchd,.wmv,.mp4,.mov,.*"
            />
            <Label
              htmlFor="product-files"
              className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm">Upload Files</span>
            </Label>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Supported formats: CBR, PDF, MOBI, AZW, DjVu, Kindle, TXT, EPUB, DOC, JPEG, PNG, WAV, MP4, Vorbis, RSS, WMA, AIFF, FLAC, AVI, WebM, MKV, HEVC, MPEG2, FLV, AVCHD, WMV, MOV, and more
      </p>
    </div>
  );
};

export default ProductFileUpload;