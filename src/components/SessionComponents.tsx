import React from 'react';

export const VideoPlayer = ({ videos }: { videos: Array<{ url: string; order: number }> }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg">
      {videos && videos.length > 0 && (
        <video
          src={videos[0].url}
          controls
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export const Chat = ({ session }: { session: any }) => {
  return (
    <div className="h-1/2 border rounded-lg p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Chat</h3>
      {/* Chat implementation */}
    </div>
  );
};

export const UserList = ({ session }: { session: any }) => {
  return (
    <div className="h-1/2 border rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-4">Participants</h3>
      {/* Participants list implementation */}
    </div>
  );
};