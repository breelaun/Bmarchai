import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  username: string;
}

const ProfileAvatar = ({ avatarUrl, fullName, username }: ProfileAvatarProps) => {
  return (
    <div className="relative">
      <Avatar className="w-32 h-32 border-4 border-background">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
          {fullName?.charAt(0) || username?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <Button 
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
      >
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              // TODO: Implement avatar upload
              console.log('Avatar upload:', e.target.files?.[0]);
            }}
          />
          <Edit className="w-4 h-4 text-primary-foreground" />
        </label>
      </Button>
    </div>
  );
};

export default ProfileAvatar;