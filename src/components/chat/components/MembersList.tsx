import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MembersListProps {
  members: any[];
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
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-[#35373C] cursor-pointer"
            >
              <img
                src={member.profiles?.avatar_url || "/api/placeholder/32/32"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[#949BA4]">{member.profiles?.username || 'Anonymous'}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MembersList;