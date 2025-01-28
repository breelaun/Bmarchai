import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Hash, Settings, Users } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  is_public: boolean;
}

interface Section {
  id: string;
  name: string;
  channel_id: string;
}

const ChatLayout = () => {
  const session = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchChannels = async () => {
      const { data: channelsData, error: channelsError } = await supabase
        .from("chat_channels")
        .select("*")
        .or(`is_public.eq.true,owner_id.eq.${session.user.id}`);

      if (channelsError) {
        console.error("Error fetching channels:", channelsError);
        return;
      }

      setChannels(channelsData);

      if (channelsData.length > 0) {
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("chat_sections")
          .select("*")
          .eq("channel_id", channelsData[0].id);

        if (sectionsError) {
          console.error("Error fetching sections:", sectionsError);
          return;
        }

        setSections(sectionsData);
      }
    };

    fetchChannels();
  }, [session?.user?.id]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Channels</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedChannel(channel.id)}
              >
                <Hash className="w-4 h-4 mr-2" />
                {channel.name}
              </Button>
            ))}
          </div>
          <div className="p-2">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create Channel
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">
              {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Users className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Messages will be rendered here */}
            <div className="text-center text-muted-foreground">
              No messages yet
            </div>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <Input
            placeholder="Type a message..."
            className="w-full"
            disabled={!selectedChannel}
          />
        </div>
      </div>

      {/* Sections Sidebar */}
      <div className="w-48 bg-muted border-l">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Sections</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-57px)]">
          <div className="p-2 space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start"
              >
                # {section.name}
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatLayout;