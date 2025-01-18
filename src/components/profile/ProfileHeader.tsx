import { Card } from "@/components/ui/card";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import type { ProfileData } from "./types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="relative w-full space-y-4"> {/* Added space-y-4 for spacing */}
      <ProfileBanner defaultBannerUrl={profile.default_banner_url} />

      {/* Moved the card down and adjusted positioning */}
      <div className="px-4"> {/* Added padding container */}
        <Card className="relative bg-card/80 backdrop-blur-sm border-primary/20 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <ProfileAvatar 
              avatarUrl={profile.avatar_url}
              fullName={profile.full_name}
              username={profile.username}
            />
            <ProfileInfo profile={profile} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileHeader;
