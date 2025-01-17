import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const VendorBanner = ({ vendorProfile, isOwner, onBannerUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error("File must be an image or video");
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorProfile.id}-banner-${Date.now()}.${fileExt}`;
      const filePath = `vendor-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const bannerData = {
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: publicUrl
      };

      const { error: updateError } = await supabase
        .from('vendor_profiles')
        .update({ banner_data: bannerData })
        .eq('id', vendorProfile.id);

      if (updateError) throw updateError;

      toast.success("Banner updated successfully");
      onBannerUpdate?.();

    } catch (error) {
      toast.error("Failed to update banner");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const BannerContent = () => {
    if (!vendorProfile?.banner_data?.url) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No banner uploaded</span>
        </div>
      );
    }

    if (vendorProfile.banner_data.type === 'video') {
      return (
        <video
          src={vendorProfile.banner_data.url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      );
    }

    return (
      <img
        src={vendorProfile.banner_data.url}
        alt="Vendor Banner"
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div className="relative h-[300px] rounded-lg overflow-hidden">
      <BannerContent />
      
      {isOwner && (
        <div className="absolute bottom-4 right-4">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="banner-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="banner-upload"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Edit Banner'}
          </label>
        </div>
      )}
    </div>
  );
};

export default VendorBanner;
