
import { useState, useEffect, useCallback } from 'react';

interface CameraConfig {
  front: boolean;
  rear: boolean;
  enabled: boolean;
}

interface UseCameraProps {
  initialConfig?: CameraConfig;
}

interface UseCameraReturn {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  switchCamera: () => Promise<void>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  currentFacingMode: 'user' | 'environment';
}

export const useCamera = ({ initialConfig }: UseCameraProps = {}): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');

  const getMediaStream = useCallback(async (facingMode: 'user' | 'environment' = 'user') => {
    try {
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      return mediaStream;
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      throw new Error(err.message);
    }
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await getMediaStream(currentFacingMode);
      setStream(mediaStream);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const switchCamera = async () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    setIsLoading(true);
    try {
      const newStream = await getMediaStream(newFacingMode);
      setStream(newStream);
      setCurrentFacingMode(newFacingMode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialConfig?.enabled) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  return {
    stream,
    error,
    isLoading,
    switchCamera,
    startCamera,
    stopCamera,
    currentFacingMode
  };
};
