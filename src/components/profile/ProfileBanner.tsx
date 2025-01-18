import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ImageCropper from "../shared/ImageCropper";

interface ProfileBannerProps {
  defaultBannerUrl?: string;
  userId?: string;
  isVendor?: boolean;
}

const ProfileBanner = ({ defaultBannerUrl, userId, isVendor }: ProfileBannerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;

    // Validate file size (5MB limit)
    if (file.size > 5000000) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        console.log('Image loaded into cropper');
        setCropperImage(result);
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: string) => {
    if (!session?.user.id) return;
    setIsUploading(true);
    console.log('Starting crop completion process');

    try {
      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      
      // Create unique filename using timestamp
      const timestamp = new Date().getTime();
      const fileExt = 'jpg';
      const filePath = `banners/${session.user.id}_${timestamp}.${fileExt}`;
      
      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false // Use unique filenames instead of overwriting
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);
      setBannerUrl(publicUrl);

      // Update profile in database
      const { error: updateError } = await supabase
        .from(isVendor ? 'vendor_profiles' : 'profiles')
        .update({
          default_banner_url: publicUrl,
          banner_media_type: 'image',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId || session.user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

      // Force reload to show new banner
      window.location.reload();
    } catch (error: any) {
      console.error('Error in handleCropComplete:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsCropperOpen(false);
      setCropperImage(null);
    }
  };

  const displayBannerUrl = bannerUrl || defaultBannerUrl || '/default-banner.png';
  console.log('Current banner URL:', displayBannerUrl);

  return (
    <>
      <div className="relative w-full h-[400px] overflow-hidden">
        <img 
          src={displayBannerUrl}
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
        
        {session && (userId === undefined || userId === session.user.id) && (
          <label className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="secondary" 
              className="relative overflow-hidden backdrop-blur-sm hover:bg-primary/10"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Edit Banner"}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={isUploading}
              />
            </Button>
          </label>
        )}
      </div>

      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCropComplete={handleCropComplete}
          aspectRatio={21/9}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setCropperImage(null);
          }}
        />
      )}
    </>
  );
};

export default ProfileBanner;
