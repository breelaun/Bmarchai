import { Button } from "@/components/ui/button";
import ProfileBanner from "../../profile/ProfileBanner";
import ProfileAvatar from "../../profile/ProfileAvatar";
import { Profile } from "@/types/profile";
import { Menu } from "lucide-react";
import { useState } from "react";

interface VendorHeaderProps {
  profile: Profile | null;
  aboutMe?: string;
}

const VendorHeader = ({ profile, aboutMe }: VendorHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <ProfileBanner defaultBannerUrl={profile?.default_banner_url} />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background to-transparent">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <ProfileAvatar 
              avatarUrl={profile?.avatar_url}
              fullName={profile?.full_name}
              username={profile?.username}
              size="lg"
            />
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{profile?.full_name || "Your Name"}</h1>
              <p className="text-white/80">@{profile?.username}</p>
              <p className="text-white/60 text-sm md:text-base mt-2 line-clamp-2 md:line-clamp-none">
                {aboutMe || "Add short sentence about your values"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 w-full md:w-auto">
                Book Session
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 p-4 md:hidden">
          <div className="container mx-auto space-y-4">
            <Button 
              variant="ghost" 
              className="w-full text-left justify-start"
              onClick={() => setIsMenuOpen(false)}
            >
              Close Menu
            </Button>
            {/* Add your mobile menu items here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorHeader;