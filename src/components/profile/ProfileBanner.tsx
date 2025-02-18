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
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;

    if (file.size > 10000000) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast({
        title: "Error",
        description: "Please upload a valid image or video file",
        variant: "destructive",
      });
      return;
    }

    setMediaType(isVideo ? 'video' : 'image');

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setCropperImage(result);
          setIsCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${session!.user.id}_${timestamp}.${fileExt}`;
      const filePath = `banners/${session!.user.id}/${fileName}`;
      
      console.log('Uploading file to path:', filePath); // Debug log
      
      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      console.log('Upload successful, data:', data); // Debug log

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl); // Debug log

      setBannerUrl(publicUrl);

      const { error: updateError } = await supabase
        .from(isVendor ? 'vendor_profiles' : 'profiles')
        .update({
          default_banner_url: publicUrl,
          banner_media_type: mediaType,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId || session!.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error: any) {
      console.error('Error in handleFileUpload:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    if (!session?.user.id) return;
    
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      await handleFileUpload(new File([blob], 'cropped-banner.jpg', { type: 'image/jpeg' }));
    } catch (error: any) {
      console.error('Error in handleCropComplete:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsCropperOpen(false);
      setCropperImage(null);
    }
  };

  // Use the most recent banner URL, falling back to the default
  const displayBannerUrl = bannerUrl || defaultBannerUrl || '/default-banner.png';
  const isBannerVideo = displayBannerUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <>
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
        {isBannerVideo ? (
          <video 
            src={displayBannerUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img 
            src={displayBannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}
        
        {session && (userId === undefined || userId === session.user.id) && (
          <div className="absolute bottom-4 right-4 z-10">
            <label className="relative">
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
                  accept="image/*,video/*"
                  onChange={handleBannerUpload}
                  disabled={isUploading}
                />
              </Button>
            </label>
          </div>
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