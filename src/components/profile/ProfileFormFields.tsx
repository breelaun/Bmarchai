import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileData } from "./types";

interface ProfileFormFieldsProps {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
}

const ProfileFormFields = ({ profile, setProfile }: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="username">
          Username <span className="text-red-500">*</span>
        </Label>
        <Input
          id="username"
          value={profile.username || ""}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          value={profile.full_name || ""}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={profile.date_of_birth || ""}
          onChange={(e) =>
            setProfile({ ...profile, date_of_birth: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={profile.country || ""}
          onChange={(e) =>
            setProfile({ ...profile, country: e.target.value })
          }
          placeholder="Enter your country"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={profile.gender || ""}
          onValueChange={(value) =>
            setProfile({ ...profile, gender: value as 'Male' | 'Female' | null })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={profile.phone_number || ""}
          onChange={(e) =>
            setProfile({ ...profile, phone_number: e.target.value })
          }
          placeholder="Enter your phone number"
        />
      </div>
    </>
  );
};

export default ProfileFormFields;