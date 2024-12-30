import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileInfoProps {
  fullName: string;
  username: string;
}

const ProfileInfo = ({ fullName, username }: ProfileInfoProps) => {
  return (
    <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold font-heading">{fullName}</h1>
        <p className="text-muted-foreground">@{username}</p>
      </div>

      <Button 
        variant="outline" 
        className="border-primary/20 hover:bg-primary/10"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileInfo;