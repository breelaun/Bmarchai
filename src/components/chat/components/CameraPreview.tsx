import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CameraPreviewProps {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  onStart: () => Promise<void>;
  onStop: () => void;
  onSwitch: () => Promise<void>;
  isCameraOn: boolean;
}

const CameraPreview = ({
  stream,
  error,
  isLoading,
  onStart,
  onStop,
  onSwitch,
  isCameraOn
}: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Camera Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Camera Preview</h3>
        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            onClick={isCameraOn ? onStop : onStart}
            disabled={isLoading}
          >
            {isCameraOn ? (
              <CameraOff className="h-4 w-4" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          {isCameraOn && (
            <Button
              variant="outline"
              size="icon"
              onClick={onSwitch}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {isCameraOn && (
        <div className="aspect-video bg-black rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Card>
  );
};

export default CameraPreview;
