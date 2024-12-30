import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileBannerProps {
  defaultBannerUrl?: string;
}

const ProfileBanner = ({ defaultBannerUrl }: ProfileBannerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
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
        .from('profiles')
        .update({ default_banner_url: publicUrl })
        .eq('id', session.user.id);

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
    }
  };

  const displayBannerUrl = bannerUrl || defaultBannerUrl || '/lovable-uploads/3736fb63-bd29-4e8a-833f-6a29178e4460.png';

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity duration-300"
          style={{ backgroundImage: `url(${displayBannerUrl})` }}
        />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <Button 
          variant="outline" 
          size="lg"
          className="bg-background/20 backdrop-blur-sm border-primary/20 hover:bg-background/30"
        >
          <Play className="w-6 h-6 text-primary mr-2" />
          Play Intro Video
        </Button>
      </div>
      
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
    </div>
  );
};

export default ProfileBanner;