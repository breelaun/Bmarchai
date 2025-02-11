
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SessionCard from "./SessionCard";
import type { SessionWithVendor } from "@/types/session";

interface CompletedSessionsProps {
  sessions: SessionWithVendor[];
}

const CompletedSessions = ({ sessions }: CompletedSessionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between p-4"
        >
          <span className="font-semibold">
            Completed Sessions ({sessions.length})
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CompletedSessions;
