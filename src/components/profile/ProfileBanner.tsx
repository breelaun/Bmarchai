import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ImageCropper from "../shared/ImageCropper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileBannerProps {
  defaultBannerUrl?: string;
  userId?: string;
  isVendor?: boolean;
}

interface MediaInfo {
  url: string;
  type: 'image' | 'video';
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const ProfileBanner = ({ defaultBannerUrl, userId, isVendor }: ProfileBannerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Get thumbnail from 1 second mark
      };
      video.oncanplay = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg');
        resolve(thumbnail);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;

    const isImage = type === 'image';
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: `Please upload a valid ${type} file (${allowedTypes.map(t => t.split('/')[1]).join(', ')})`,
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} size must be less than ${maxSize / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

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
      // Handle video upload directly
      setIsUploading(true);
      try {
        const thumbnail = await generateVideoThumbnail(file);
        setVideoThumbnail(thumbnail);
        await handleMediaUpload(file, 'video');
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMediaUpload = async (file: File | Blob, type: 'image' | 'video') => {
    if (!session?.user.id) return;

    try {
      const fileExt = type === 'video' ? 'mp4' : 'jpg';
      const filePath = `${session.user.id}/banner.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { 
          upsert: true,
          contentType: type === 'video' ? 'video/mp4' : 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setMedia({ url: publicUrl, type });
      
      const updateData = {
        default_banner_url: publicUrl,
        banner_media_type: type,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from(isVendor ? 'vendor_profiles' : 'profiles')
        .update(updateData)
        .eq('id', userId || session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Banner ${type} updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setIsUploading(true);
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      await handleMediaUpload(blob, 'image');
    } finally {
      setIsUploading(false);
      setIsCropperOpen(false);
      setCropperImage(null);
    }
  };

  const currentMediaUrl = media?.url || defaultBannerUrl || '/default-banner.png';
  const isVideo = media?.type === 'video' || currentMediaUrl.match(/\.(mp4|webm|mov)$/i);

  return (
    <>
      <div className="relative w-full h-[400px] overflow-hidden">
        {isVideo ? (
          <video 
            src={currentMediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img 
            src={currentMediaUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}
        
        {session && (userId === undefined || userId === session.user.id) && (
          <div className="absolute bottom-4 right-4 space-y-2">
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="bg-background/80 backdrop-blur-sm">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="image">
                <Button 
                  variant="secondary" 
                  className="relative overflow-hidden backdrop-blur-sm hover:bg-primary/10"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept={ALLOWED_IMAGE_TYPES.join(',')}
                    onChange={(e) => handleFileUpload(e, 'image')}
                    disabled={isUploading}
                  />
                </Button>
              </TabsContent>
              
              <TabsContent value="video">
                <Button 
                  variant="secondary" 
                  className="relative overflow-hidden backdrop-blur-sm hover:bg-primary/10"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Video"}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept={ALLOWED_VIDEO_TYPES.join(',')}
                    onChange={(e) => handleFileUpload(e, 'video')}
                    disabled={isUploading}
                  />
                </Button>
              </TabsContent>
            </Tabs>
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
