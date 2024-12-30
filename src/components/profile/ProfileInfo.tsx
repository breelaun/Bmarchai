import { useSession } from "@supabase/auth-helpers-react";
import ProfileEditModal from "./ProfileEditModal";
import type { ProfileData } from "./types";

interface ProfileInfoProps {
  profile: ProfileData;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const session = useSession();
  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold font-heading">{profile.full_name}</h1>
        <p className="text-muted-foreground">@{profile.username}</p>
      </div>

      {isOwnProfile && (
        <ProfileEditModal 
          profile={profile}
          userId={profile.id}
        />
      )}
    </div>
  );
};

export default ProfileInfo;