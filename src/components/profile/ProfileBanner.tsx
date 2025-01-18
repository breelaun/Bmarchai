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

    if (file.size > 5000000) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setCropperImage(result);
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: string) => {
    if (!session?.user.id) return;
    setIsUploading(true);

    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' });

      const fileExt = 'jpg';
      const filePath = `${session.user.id}/banner.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setBannerUrl(publicUrl);
      
      const { error: updateError } = await supabase
        .from(isVendor ? 'vendor_profiles' : 'profiles')
        .update(isVendor ? { banner_data: { url: publicUrl } } : { default_banner_url: publicUrl })
        .eq('id', userId || session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsCropperOpen(false);
    }
  };

  const displayBannerUrl = bannerUrl || defaultBannerUrl || '/lovable-uploads/3736fb63-bd29-4e8a-833f-6a29178e4460.png';

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
              {isUploading ? "Uploading..." : "Upload Banner"}
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