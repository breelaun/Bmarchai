import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Upload, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  username: string;
  fullName: string;
  avatarUrl: string | null;
  defaultBannerUrl?: string;
}

const ProfileHeader = ({ username, fullName, avatarUrl, defaultBannerUrl }: ProfileHeaderProps) => {
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
      
      // Update the profile with the new banner URL
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
    <div className="relative w-full">
      {/* Banner Section */}
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

      {/* Profile Info Section */}
      <Card className="relative mx-4 -mt-20 bg-card/80 backdrop-blur-sm border-primary/20 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {fullName?.charAt(0) || username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    // TODO: Implement avatar upload
                    console.log('Avatar upload:', e.target.files?.[0]);
                  }}
                />
                <Edit className="w-4 h-4 text-primary-foreground" />
              </label>
            </Button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold font-heading">{fullName}</h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>

          <Button 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;