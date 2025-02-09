
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
  CameraOff,
  Record,
  Square
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Channel } from '../types';
import { useCamera } from '@/hooks/useCamera';
import CameraPreview from './CameraPreview';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    stream,
    error: cameraError,
    isLoading: isCameraLoading,
    switchCamera,
    startCamera,
    stopCamera,
    currentFacingMode
  } = useCamera();

  const { data: sessionDetails, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session', channel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          vendor_profiles (
            business_name,
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .eq('id', channel.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!channel.id,
  });

  const startStreamMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('chat_live_sessions')
        .insert([
          {
            channel_id: channel.id,
            status: 'active',
            session_type: sessionDetails?.session_type || 'live',
            metadata: {
              started_by: (await supabase.auth.getUser()).data.user?.id,
              camera_config: {
                facingMode: currentFacingMode
              }
            }
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsStreaming(true);
      toast({
        title: "Stream started",
        description: "Your live session has begun",
      });
      queryClient.invalidateQueries({ queryKey: ['session', channel.id] });
    },
    onError: (error) => {
      toast({
        title: "Error starting stream",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const stopStreamMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('chat_live_sessions')
        .update({ status: 'ended', ended_at: new Date().toISOString() })
        .eq('channel_id', channel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsStreaming(false);
      toast({
        title: "Stream ended",
        description: "Your live session has ended",
      });
      queryClient.invalidateQueries({ queryKey: ['session', channel.id] });
    }
  });

  const startRecordingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('chat_live_sessions')
        .update({ 
          is_recording: true,
          recording_start_time: new Date().toISOString(),
          recording_settings: sessionDetails?.recording_settings
        })
        .eq('channel_id', channel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your session is now being recorded",
      });
    }
  });

  const stopRecordingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('chat_live_sessions')
        .update({ 
          is_recording: false,
          recording_end_time: new Date().toISOString()
        })
        .eq('channel_id', channel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your session recording has been saved",
      });
    }
  });

  const handleStartStream = async () => {
    await startCamera();
    startStreamMutation.mutate();
  };

  const handleStopStream = async () => {
    if (isRecording) {
      await stopRecordingMutation.mutateAsync();
    }
    stopCamera();
    stopStreamMutation.mutate();
  };

  const handleRecording = () => {
    if (isRecording) {
      stopRecordingMutation.mutate();
    } else {
      startRecordingMutation.mutate();
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [stream, stopCamera]);

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen p-2">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!sessionDetails) {
    return (
      <div className="w-full p-2">
        <Card className="w-full">
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
    <div className="w-full p-2 space-y-2">
      <Card className="w-full">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-base sm:text-lg">{sessionDetails.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`${isMicOn ? 'bg-primary/10' : ''} h-8 w-8 sm:h-9 sm:w-9`}
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
                className={`${isScreenSharing ? 'bg-primary/10' : ''} h-8 w-8 sm:h-9 sm:w-9`}
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
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Camera className="h-4 w-4" />
              </Button>
              {isStreaming && (
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleRecording}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  disabled={!isStreaming}
                >
                  {isRecording ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Record className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant={isStreaming ? "destructive" : "default"}
                onClick={isStreaming ? handleStopStream : handleStartStream}
                disabled={startStreamMutation.isPending || stopStreamMutation.isPending}
                className="flex-1 sm:flex-none h-8 sm:h-9"
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
        <CardContent className="space-y-2 p-3 sm:p-6">
          {cameraError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
              {cameraError}
            </div>
          )}
          
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
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

          <div className="mt-2 sm:mt-4">
            <h3 className="font-semibold text-base sm:text-lg">Session Details</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Type: {sessionDetails.session_type}</p>
              <p>Duration: {sessionDetails.duration}</p>
              <p>Max Participants: {sessionDetails.max_participants}</p>
              {sessionDetails.description && (
                <p>Description: {sessionDetails.description}</p>
              )}
              {isRecording && (
                <p className="text-destructive">Recording in progress...</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSession;
