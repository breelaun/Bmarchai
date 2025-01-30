import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Video, Phone, Settings } from "lucide-react";
import { Session } from '@supabase/auth-helpers-react';

interface UserProfileProps {
  session: Session | null;
}

const UserProfile = ({ session }: UserProfileProps) => {
  return (
    <div className="p-4 bg-[#232428] mt-auto">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {session?.user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm text-white font-medium">
            {session?.user?.email?.split("@")[0]}
          </p>
          <p className="text-xs text-[#949BA4]">Online</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;