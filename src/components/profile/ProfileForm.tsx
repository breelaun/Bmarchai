import { Button } from "@/components/ui/button";
import ProfileFormFields from "./ProfileFormFields";
import VendorToggle from "./VendorToggle";
import { useProfileUpdate } from "./useProfileUpdate";
import type { ProfileData } from "./types";

interface ProfileFormProps {
  initialProfile: ProfileData;
  userId: string;
}

const ProfileForm = ({ initialProfile, userId }: ProfileFormProps) => {
  const { profile, setProfile, handleUpdateProfile } = useProfileUpdate(userId, initialProfile);

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <ProfileFormFields 
        profile={profile}
        setProfile={setProfile}
      />
      
      <VendorToggle 
        isVendor={profile.is_vendor || false}
        onToggle={(checked) => setProfile((prev) => ({ ...prev, is_vendor: checked }))}
      />

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;