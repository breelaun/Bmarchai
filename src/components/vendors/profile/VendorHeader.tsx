import { Button } from "@/components/ui/button";
import ProfileBanner from "../../profile/ProfileBanner";
import ProfileAvatar from "../../profile/ProfileAvatar";
import { Profile } from "@/types/profile";

interface VendorHeaderProps {
  profile: Profile | null;
  aboutMe?: string;
}

const VendorHeader = ({ profile, aboutMe }: VendorHeaderProps) => {
  return (
    <div className="relative">
      <ProfileBanner defaultBannerUrl={profile?.default_banner_url} />
      <div className="absolute bottom-[-50px] left-0 right-0 p-6 bg-gradient-to-t from-background/75 via-background/50 to-transparent">
        <div className="container mx-auto flex items-end gap-6">
          <ProfileAvatar 
            avatarUrl={profile?.avatar_url}
            fullName={profile?.full_name}
            username={profile?.username}
            size="lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{profile?.full_name || "Your Name"}</h1>
            <p className="text-white/80">@{profile?.username}</p>
            <p className="text-white/60 mt-2">{aboutMe || "Add short sentence about your values"}</p>
          </div>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;
