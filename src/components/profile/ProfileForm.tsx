import { Button } from "@/components/ui/button";
import ProfileFormFields from "./ProfileFormFields";
import VendorToggle from "./VendorToggle";
import { useProfileUpdate } from "./useProfileUpdate";
import type { ProfileData } from "./types";

interface ProfileFormProps {
  initialProfile: ProfileData;
  userId: string;
  onSuccess?: () => void;
}

const ProfileForm = ({ initialProfile, userId, onSuccess }: ProfileFormProps) => {
  const { profile, setProfile, handleUpdateProfile } = useProfileUpdate(userId, initialProfile, onSuccess);

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