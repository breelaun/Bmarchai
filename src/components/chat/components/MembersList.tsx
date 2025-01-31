import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from '@supabase/auth-helpers-react';

interface MembersListProps {
  members: Array<{
    profiles: {
      username: string;
      avatar_url: string | null;
    } | null;
  }>;
  session: Session | null;
  isMobile?: boolean;
  showMembers?: boolean;
  showSidebar?: boolean;
  channelId?: string | null;
}

const MembersList = ({ members, session, isMobile, showMembers, showSidebar }: MembersListProps) => {
  return (
    <div className={`${isMobile ? (showMembers ? 'absolute right-0 z-20' : 'hidden') : ''} w-60 bg-[#2B2D31] p-4 h-full`}>
      <h3 className="text-[#949BA4] font-semibold mb-4">Online</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.profiles?.username} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.profiles?.avatar_url || undefined} />
              <AvatarFallback>
                {member.profiles?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[#949BA4] truncate">
              {member.profiles?.username}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {session?.user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-[#949BA4] truncate">
            {session?.user?.email?.split("@")[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MembersList;