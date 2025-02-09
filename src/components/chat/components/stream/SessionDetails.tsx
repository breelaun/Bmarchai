
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import type { Session } from '../../types';

interface SessionDetailsProps {
  sessionDetails: Session;
  isRecording: boolean;
  recordingStartTime?: string;
}

const SessionDetails = ({ sessionDetails, isRecording, recordingStartTime }: SessionDetailsProps) => {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording && recordingStartTime) {
      const updateTimer = () => {
        const start = new Date(recordingStartTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      };

      updateTimer(); // Initial call
      intervalId = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, recordingStartTime]);

  return (
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
          <div className="flex items-center gap-2 text-destructive font-medium">
            <Timer className="h-4 w-4 animate-pulse" />
            <span>Recording: {elapsedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetails;
