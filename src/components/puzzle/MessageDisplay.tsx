import { MessageDisplayProps } from "./types";

const MessageDisplay = ({ message }: MessageDisplayProps) => {
  if (!message) return null;
  
  return (
    <div className="bg-muted p-4 rounded-lg animate-[fade-in_0.3s_ease-out]">
      {message}
    </div>
  );
};

export default MessageDisplay;