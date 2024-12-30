import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Upload, Edit } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  fullName: string;
  avatarUrl: string | null;
}

const ProfileHeader = ({ username, fullName, avatarUrl }: ProfileHeaderProps) => {
  const session = useSession();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;

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
    } catch (error) {
      console.error('Error uploading banner:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Banner Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/af4b09d3-de75-4b0b-bd1b-da5ce77a3cbb.png')] opacity-20 bg-cover bg-center" />
          </div>
        )}
        
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
          <Button variant="secondary" className="relative overflow-hidden backdrop-blur-sm">
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Banner"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*,video/*"
              onChange={handleBannerUpload}
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