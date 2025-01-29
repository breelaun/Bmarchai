import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFile } from "../types";

interface ProductFileUploadProps {
  onFilesChange: (files: ProductFile[]) => void;
  files: ProductFile[];
  category?: string;
  onEmbedChange?: (embedData: {
    url: string;
    autoplayStart?: string;
    autoplayEnd?: string;
  }) => void;
  embedData?: {
    url: string;
    autoplayStart?: string;
    autoplayEnd?: string;
  };
}

const ProductFileUpload = ({ 
  onFilesChange, 
  files, 
  category,
  onEmbedChange,
  embedData = { url: '', autoplayStart: '', autoplayEnd: '' }
}: ProductFileUploadProps) => {
  const [showEmbedForm, setShowEmbedForm] = useState(!!embedData.url);

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

  const handleEmbedChange = (field: string, value: string) => {
    if (onEmbedChange) {
      onEmbedChange({
        ...embedData,
        [field]: value
      });
    }
  };

  const validateTimeFormat = (time: string): boolean => {
    // Accept MM:SS or HH:MM:SS format
    return /^(?:[0-5]\d:)?[0-5]\d:[0-5]\d$/.test(time);
  };

  return (
    <div className="space-y-6">
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

      {category === 'session' && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <Label>Embed Content</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEmbedForm(!showEmbedForm)}
            >
              {showEmbedForm ? 'Hide Embed Options' : 'Add Embed'}
            </Button>
          </div>

          {showEmbedForm && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="embed-url">Embed URL</Label>
                  <div className="relative mt-1">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="embed-url"
                      type="url"
                      placeholder="https://..."
                      value={embedData.url}
                      onChange={(e) => handleEmbedChange('url', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="autoplay-start">Autoplay Start Time (HH:MM:SS)</Label>
                  <Input
                    id="autoplay-start"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayStart}
                    onChange={(e) => {
                      if (validateTimeFormat(e.target.value) || e.target.value === '') {
                        handleEmbedChange('autoplayStart', e.target.value);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="autoplay-end">Autoplay End Time (HH:MM:SS)</Label>
                  <Input
                    id="autoplay-end"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayEnd}
                    onChange={(e) => {
                      if (validateTimeFormat(e.target.value) || e.target.value === '') {
                        handleEmbedChange('autoplayEnd', e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              {embedData.url && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="aspect-video mt-2">
                    <iframe
                      src={embedData.url}
                      className="w-full h-full border rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFileUpload;
