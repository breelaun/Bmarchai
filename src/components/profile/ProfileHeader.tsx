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
    <div className="relative w-full">
      <ProfileBanner defaultBannerUrl={profile.default_banner_url} />

      <Card className="relative mx-4 -mt-20 bg-card/80 backdrop-blur-sm border-primary/20 p-6">
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
  );
};

export default ProfileHeader;