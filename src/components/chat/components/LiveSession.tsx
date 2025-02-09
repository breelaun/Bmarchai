
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Users,
  ScreenShare,
  ScreenShareOff,
  DollarSign,
  ShoppingCart,
  Camera,
  CameraOff
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Channel } from '../types';
import { useCamera } from '@/hooks/useCamera';
import CameraPreview from './CameraPreview';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const { data: sessionDetails, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', channel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', channel.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const {
    stream,
    error: cameraError,
    isLoading: isCameraLoading,
    startCamera,
    stopCamera,
    switchCamera
  } = useCamera();

  const startStreamMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('chat_live_sessions')
        .insert([
          { channel_id: channel.id, is_live: true }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setIsStreaming(true);
      toast({
        title: "Stream started",
        description: "Your live session has begun.",
      });
      queryClient.invalidateQueries({ queryKey: ['session', channel.id] });
    },
    onError: (error) => {
      toast({
        title: "Error starting stream",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stopStreamMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('chat_live_sessions')
        .delete()
        .eq('channel_id', channel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsStreaming(false);
      toast({
        title: "Stream ended",
        description: "Your live session has ended.",
      });
      queryClient.invalidateQueries({ queryKey: ['session', channel.id] });
    },
    onError: (error) => {
      toast({
        title: "Error ending stream",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartStream = async () => {
    await startCamera();
    startStreamMutation.mutate();
  };

  const handleStopStream = async () => {
    stopStreamMutation.mutate();
    await stopCamera();
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[100dvh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!sessionDetails) {
    return (
      <div className="w-full h-full min-h-[100dvh] flex items-center justify-center">
        <Card className="w-full mx-4">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Session not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[100dvh] flex flex-col bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <CardHeader className="p-3">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-base">{sessionDetails.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`${isMicOn ? 'bg-primary/10' : ''} h-8 w-8`}
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
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`${isScreenSharing ? 'bg-primary/10' : ''} h-8 w-8`}
              >
                {isScreenSharing ? (
                  <ScreenShareOff className="h-4 w-4" />
                ) : (
                  <ScreenShare className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={switchCamera}
                disabled={!stream}
                className="h-8 w-8"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                variant={isStreaming ? "destructive" : "default"}
                onClick={isStreaming ? handleStopStream : handleStartStream}
                disabled={startStreamMutation.isPending || stopStreamMutation.isPending}
                className="flex-1 sm:flex-none h-8"
              >
                {startStreamMutation.isPending || stopStreamMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isStreaming ? (
                  <>
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Stream
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Stream
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </div>

      <div className="flex-1 flex flex-col">
        {cameraError && (
          <div className="m-3 bg-destructive/10 text-destructive p-3 rounded-lg">
            {cameraError}
          </div>
        )}
        
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <CameraPreview 
              stream={stream}
              error={cameraError}
              isLoading={isCameraLoading}
              onStart={startCamera}
              onStop={stopCamera}
              onSwitch={switchCamera}
              isCameraOn={!!stream}
            />
          </div>
        </div>

        <div className="p-3 bg-background/80 backdrop-blur-sm border-t">
          <h3 className="font-semibold text-base">Session Details</h3>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>Type: {sessionDetails.session_type}</p>
            <p>Duration: {sessionDetails.duration}</p>
            <p>Max Participants: {sessionDetails.max_participants}</p>
            {sessionDetails.description && (
              <p>Description: {sessionDetails.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;

