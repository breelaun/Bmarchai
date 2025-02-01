import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause } from "lucide-react";
import type { Channel } from '../types';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  if (!activeSession) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No active live session at the moment.
            </p>
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
            <span>Live Session</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {channel.stream_config?.embed_url && (
            <div className="aspect-video">
              <iframe
                src={channel.stream_config.embed_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Session started: {new Date(activeSession.started_at).toLocaleString()}
            </p>
            {activeSession.metadata?.viewers && (
              <p className="text-sm text-muted-foreground">
                Viewers: {activeSession.metadata.viewers}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSession;