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

const ProductFileUpload = ({ files, onFilesChange, category, embedData, onEmbedChange }) => {
  const [showEmbedForm, setShowEmbedForm] = useState(false);

  const handleEmbedChange = (key, value) => {
    onEmbedChange({
      ...embedData,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Files</label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            onFilesChange(
              Array.from(e.target.files || []).map((file) => ({ file, type: file.type }))
            )
          }
        />
      </div>

      {/* Conditional Embed Form for "session" category */}
      {category === "session" && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Embed Content</label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setShowEmbedForm(!showEmbedForm)}
            >
              {showEmbedForm ? "Hide Embed Options" : "Add Embed"}
            </button>
          </div>

          {showEmbedForm && (
            <div className="space-y-4">
              {/* Embed URL */}
              <div>
                <label htmlFor="embed-url" className="block text-sm font-medium text-gray-700">
                  Embed URL
                </label>
                <input
                  id="embed-url"
                  type="url"
                  placeholder="https://example.com"
                  value={embedData.url}
                  onChange={(e) => handleEmbedChange("url", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              {/* Autoplay Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="autoplay-start" className="block text-sm font-medium text-gray-700">
                    Autoplay Start (HH:MM:SS)
                  </label>
                  <input
                    id="autoplay-start"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayStart}
                    onChange={(e) => handleEmbedChange("autoplayStart", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="autoplay-end" className="block text-sm font-medium text-gray-700">
                    Autoplay End (HH:MM:SS)
                  </label>
                  <input
                    id="autoplay-end"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayEnd}
                    onChange={(e) => handleEmbedChange("autoplayEnd", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Embed Preview */}
              {embedData.url && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Preview</label>
                  <iframe
                    src={embedData.url}
                    className="w-full h-64 border rounded-md"
                    allowFullScreen
                  />
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
