
import React from 'react';
import type { Session } from '../../types';

interface SessionDetailsProps {
  sessionDetails: Session;
  isRecording: boolean;
}

const SessionDetails = ({ sessionDetails, isRecording }: SessionDetailsProps) => {
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
          <p className="text-destructive">Recording in progress...</p>
        )}
      </div>
    </div>
  );
};

export default SessionDetails;
