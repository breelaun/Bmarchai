import React from 'react';
import { Bell, Users } from 'lucide-react';

interface SidebarActionsProps {
  pendingRequests: number;
  onlineUsers: number;
}

const SidebarActions = ({ pendingRequests, onlineUsers }: SidebarActionsProps) => {
  return (
    <>
      <div className="flex items-center justify-between space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>Requests</span>
        </div>
        {pendingRequests > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {pendingRequests}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Online</span>
        </div>
        {onlineUsers > 0 && (
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            {onlineUsers}
          </span>
        )}
      </div>
    </>
  );
};

export default SidebarActions;