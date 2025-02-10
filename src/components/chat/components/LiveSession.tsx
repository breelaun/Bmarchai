
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Channel } from '../types';
import { useCamera } from '@/hooks/useCamera';
import CameraPreview from './CameraPreview';
import StreamControls from './stream/StreamControls';
import SessionDetails from './stream/SessionDetails';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<string | undefined>();
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
      const startTime = new Date().toISOString();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('session_recordings')
        .insert({
          session_id: sessionDetails?.id,
          channel_id: channel.id,
          created_by: user.id,
          started_at: startTime,
          status: 'recording',
          metadata: {
            quality: 'high',
            format: 'webm'
          }
        });

      if (error) throw error;
      
      return startTime;
    },
    onSuccess: (startTime) => {
      setIsRecording(true);
      setRecordingStartTime(startTime);
      toast({
        title: "Recording started",
        description: "Your session is now being recorded",
      });
    }
  });

  const stopRecordingMutation = useMutation({
    mutationFn: async () => {
      const endTime = new Date().toISOString();
      
      const { error } = await supabase
        .from('session_recordings')
        .update({ 
          status: 'processing',
          ended_at: endTime
        })
        .eq('channel_id', channel.id)
        .eq('status', 'recording');

      if (error) throw error;
      
      return endTime;
    },
    onSuccess: () => {
      setIsRecording(false);
      setRecordingStartTime(undefined);
      toast({
        title: "Recording stopped",
        description: "Your session recording is being processed",
      });
      queryClient.invalidateQueries({ queryKey: ['session', channel.id] });
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
    if (!stream && !isStreaming) {
      toast({
        title: "Camera required",
        description: "Please start your camera or stream before recording",
        variant: "destructive"
      });
      return;
    }

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
            <StreamControls
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
              isScreenSharing={isScreenSharing}
              setIsScreenSharing={setIsScreenSharing}
              isStreaming={isStreaming}
              isRecording={isRecording}
              stream={stream}
              switchCamera={switchCamera}
              handleRecording={handleRecording}
              handleStreamToggle={isStreaming ? handleStopStream : handleStartStream}
              startStreamMutation={startStreamMutation}
              stopStreamMutation={stopStreamMutation}
            />
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

          <SessionDetails 
            sessionDetails={sessionDetails}
            isRecording={isRecording}
            recordingStartTime={recordingStartTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSession;
