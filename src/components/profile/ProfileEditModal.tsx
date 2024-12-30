import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ProfileForm from "./ProfileForm";
import type { ProfileData } from "./types";

interface ProfileEditModalProps {
  profile: ProfileData;
  userId: string;
}

const ProfileEditModal = ({ profile, userId }: ProfileEditModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-primary/20 hover:bg-primary/10"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto py-4">
          <ProfileForm 
            initialProfile={profile} 
            userId={userId}
            onSuccess={() => {
              setOpen(false);
              window.location.reload();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;