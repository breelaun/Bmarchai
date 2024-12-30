import { Card } from "@/components/ui/card";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";

interface ProfileHeaderProps {
  username: string;
  fullName: string;
  avatarUrl: string | null;
  defaultBannerUrl?: string;
}

const ProfileHeader = ({ username, fullName, avatarUrl, defaultBannerUrl }: ProfileHeaderProps) => {
  return (
    <div className="relative w-full">
      <ProfileBanner defaultBannerUrl={defaultBannerUrl} />

      <Card className="relative mx-4 -mt-20 bg-card/80 backdrop-blur-sm border-primary/20 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <ProfileAvatar 
            avatarUrl={avatarUrl}
            fullName={fullName}
            username={username}
          />
          <ProfileInfo 
            fullName={fullName}
            username={username}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;