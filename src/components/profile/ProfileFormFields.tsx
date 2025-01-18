import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProfileData } from "./types";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ProfileFormFieldsProps {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
  isVendor?: boolean;
}

const ProfileFormFields = ({ profile, setProfile }: ProfileFormFieldsProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  return (
    <>
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          
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
                setProfile({ ...profile, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
        </div>

        {/* Password Management Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Management</h3>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            {newPassword && (
              <div className="space-y-1">
                <Progress value={passwordStrength} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Password strength: {passwordStrength}%
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="2fa"
              checked={profile.two_factor_enabled || false}
              onCheckedChange={(checked) =>
                setProfile({ ...profile, two_factor_enabled: checked })
              }
            />
            <Label htmlFor="2fa">Enable Two-Factor Authentication (2FA)</Label>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              checked={profile.email_notifications || false}
              onCheckedChange={(checked) =>
                setProfile({ ...profile, email_notifications: checked })
              }
            />
            <Label htmlFor="emailNotifications">Email Notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="smsNotifications"
              checked={profile.sms_notifications || false}
              onCheckedChange={(checked) =>
                setProfile({ ...profile, sms_notifications: checked })
              }
            />
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileFormFields;