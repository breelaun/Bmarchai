import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Play, 
  Pause, 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Users
} from "lucide-react";
import type { Channel } from '../types';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const { data: activeSession, isLoading } = useQuery({
    queryKey: ['live-session', channel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_live_sessions')
        .select('*')
        .eq('channel_id', channel.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!channel.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const handleStartSession = async () => {
    // Implementation for starting a new session will go here
    setIsPlaying(true);
  };

  if (!activeSession) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Video className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No active live session at the moment.
            </p>
            <Button 
              onClick={handleStartSession}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Start Live Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span>Live Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={isMicOn ? 'bg-primary/10' : ''}
              >
                {isMicOn ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={isCameraOn ? 'bg-primary/10' : ''}
              >
                {isCameraOn ? (
                  <Camera className="h-4 w-4" />
                ) : (
                  <CameraOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className={isPlaying ? 'bg-primary/10' : ''}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {channel.stream_config?.embed_url && (
            <div className="aspect-video rounded-lg overflow-hidden border border-border">
              <iframe
                src={channel.stream_config.embed_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Session started: {new Date(activeSession.started_at).toLocaleString()}
            </p>
            {activeSession.metadata?.viewers && (
              <p className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {activeSession.metadata.viewers} viewers
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSession;