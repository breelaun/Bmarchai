import React from 'react';
import { Grid } from './Grid';
import { Controls } from './Controls';
import ServerList from './components/ServerList';
import ChannelList from './components/ChannelList';
import MessageArea from './components/MessageArea';
import MembersList from './components/MembersList';
import ContactRequests from '../contacts/ContactRequests';

const ChatLayout = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Grid>
        <div className="col-span-1 bg-background border-r">
          <ServerList />
        </div>
        <div className="col-span-2 bg-background border-r flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChannelList />
          </div>
          <div className="p-4 border-t">
            <ContactRequests />
          </div>
        </div>
        <div className="col-span-6 bg-background flex flex-col">
          <MessageArea />
          <Controls />
        </div>
        <div className="col-span-3 bg-background border-l">
          <MembersList />
        </div>
      </Grid>
    </div>
  );
};

export default ChatLayout;