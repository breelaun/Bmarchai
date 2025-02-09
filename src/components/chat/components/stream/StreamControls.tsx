
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  ScreenShare, 
  ScreenShareOff,
  Camera,
  VideoOff,
  Square,
  CircleSlash
} from "lucide-react";
import type { UseMutationResult } from '@tanstack/react-query';

interface StreamControlsProps {
  isMicOn: boolean;
  setIsMicOn: (value: boolean) => void;
  isScreenSharing: boolean;
  setIsScreenSharing: (value: boolean) => void;
  isStreaming: boolean;
  isRecording: boolean;
  stream: MediaStream | null;
  switchCamera: () => void;
  handleRecording: () => void;
  handleStreamToggle: () => void;
  startStreamMutation: UseMutationResult<any, Error, void>;
  stopStreamMutation: UseMutationResult<any, Error, void>;
}

const StreamControls = ({
  isMicOn,
  setIsMicOn,
  isScreenSharing,
  setIsScreenSharing,
  isStreaming,
  isRecording,
  stream,
  switchCamera,
  handleRecording,
  handleStreamToggle,
  startStreamMutation,
  stopStreamMutation
}: StreamControlsProps) => {
  return (
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
            <CircleSlash className="h-4 w-4" />
          )}
        </Button>
      )}
      <Button
        variant={isStreaming ? "destructive" : "default"}
        onClick={handleStreamToggle}
        disabled={startStreamMutation.isPending || stopStreamMutation.isPending}
        className="flex-1 sm:flex-none h-8 sm:h-9"
      >
        {startStreamMutation.isPending || stopStreamMutation.isPending ? (
          <span className="loading loading-spinner" />
        ) : isStreaming ? (
          <>
            <VideoOff className="h-4 w-4 mr-2" />
            Stop Stream
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Start Stream
          </>
        )}
      </Button>
    </div>
  );
};

export default StreamControls;
