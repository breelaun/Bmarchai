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
  // ... all your existing state and hooks remain exactly the same ...

  if (isLoading) {
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSession;
