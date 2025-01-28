import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./components/ImageUpload";
import ProductDetails from "./components/ProductDetails";
import PricingInventory from "./components/PricingInventory";
import CategoryInput from "./components/CategoryInput";
import ProductFileUpload from "./components/ProductFileUpload";
import type { ProductFormData, ProductFile } from "./types";

const ProductUploadForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [embedData, setEmbedData] = useState({
    url: '',
    autoplayStart: '',
    autoplayEnd: ''
  });

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add products",
      });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = null;
      let productFileUrls: string[] = [];

      // Upload product image
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Upload product files
      for (const productFile of productFiles) {
        const fileExt = productFile.file.name.split('.').pop();
        const filePath = `${session.user.id}/files/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, productFile.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        productFileUrls.push(publicUrl);
      }

      const validateTimeFormat = (time: string): boolean => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        return timeRegex.test(time);
      };

      // Create the product first
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          vendor_id: session.user.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          inventory_count: data.inventory_count,
          image_url: imageUrl,
          file_urls: productFileUrls,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Add session data if embed fields are filled
      if (embedData.url) {
        const { error: sessionError } = await supabase
          .from('sessions')
          .insert({
            vendor_id: session.user.id,
            name: data.name,
            description: data.description,
            price: data.price,
            duration: '1:00:00', // Default 1 hour duration - adjust as needed
            max_participants: data.inventory_count,
            embed_url: embedData.url,
            autoplay_start: embedData.autoplayStart || null,
            autoplay_end: embedData.autoplayEnd || null,
          });

        if (sessionError) throw sessionError;
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      reset();
      setImageFile(null);
      setProductFiles([]);
      setEmbedData({ url: '', autoplayStart: '', autoplayEnd: '' });
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      onSuccess?.();

    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add product",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ProductDetails register={register} errors={errors} />
          <PricingInventory register={register} errors={errors} />
          <CategoryInput register={register} />
          <ImageUpload onImageChange={setImageFile} imageFile={imageFile} />
          <ProductFileUpload files={productFiles} onFilesChange={setProductFiles} />

          {/* Embed Section - Always Visible */}
          <div className="space-y-6 border-t pt-6">
            <label className="block text-lg font-medium text-gray-100">Embed Content</label>
            <div className="space-y-6">
              <div>
                <label htmlFor="embed-url" className="block text-sm font-medium text-gray-100">
                  Embed URL
                </label>
                <input
                  id="embed-url"
                  type="url"
                  placeholder="https://example.com"
                  value={embedData.url}
                  onChange={(e) => setEmbedData({ ...embedData, url: e.target.value })}
                  className="mt-1 block w-full rounded-lg bg-black text-white border-gray-700 focus:border-[#f7bd00] focus:ring-[#f7bd00] shadow-sm p-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="autoplay-start" className="block text-sm font-medium text-gray-100">
                    Autoplay Start (HH:MM:SS)
                  </label>
                  <input
                    id="autoplay-start"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayStart}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (validateTimeFormat(value) || value === "") {
                        setEmbedData({ ...embedData, autoplayStart: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-lg bg-black text-white border-gray-700 focus:border-[#f7bd00] focus:ring-[#f7bd00] shadow-sm p-3"
                  />

                  <input
                    id="autoplay-end"
                    type="text"
                    placeholder="00:00:00"
                    value={embedData.autoplayEnd}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (validateTimeFormat(value) || value === "") {
                        setEmbedData({ ...embedData, autoplayEnd: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-lg bg-black text-white border-gray-700 focus:border-[#f7bd00] focus:ring-[#f7bd00] shadow-sm p-3"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductUploadForm;
