import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="relative w-full h-[300px] overflow-hidden rounded-t-xl bg-gradient-to-r from-background to-secondary">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        )}
        
        <label className="absolute bottom-4 right-4">
          <Button variant="secondary" className="relative overflow-hidden">
            {isUploading ? "Uploading..." : "Change Banner"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleBannerUpload}
            />
          </Button>
        </label>
      </div>

      {/* Profile Info Section */}
      <Card className="relative mx-4 -mt-20 bg-card/80 backdrop-blur-sm border-border/50 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-4xl">
                {fullName?.charAt(0) || username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
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
                <span className="sr-only">Change avatar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </label>
            </Button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>

          <Button variant="outline">Edit Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;