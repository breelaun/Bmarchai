import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Hash, Settings, Users, MessageSquare, Video, Phone, PlusCircle, Smile, AtSign, Gift, ImagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

const ChatLayout = () => {
  const session = useSession();
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

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
        setSelectedChannel(channelsData[0].id);
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

  useEffect(() => {
    if (!selectedChannel || !session?.user?.id || isSubscribed) return;

    const fetchMessages = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select(`
          *,
          sender:sender_id (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", selectedChannel)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }

      setMessages(messagesData);
    };

    fetchMessages();

    const channel = supabase
      .channel("chat-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${selectedChannel}`,
        },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchMessages();
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [selectedChannel, session?.user?.id, isSubscribed]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChannel || !session?.user?.id) return;

    const { error } = await supabase.from("chat_messages").insert({
      channel_id: selectedChannel,
      sender_id: session.user.id,
      content: messageInput.trim(),
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessageInput("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#313338] mt-16">
      {/* Server List Sidebar */}
      <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#313338] hover:bg-primary text-white"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <div className="w-8 h-[2px] bg-[#35363C] rounded-lg my-2" />
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#313338] hover:bg-primary text-white"
            onClick={() => setSelectedChannel(channel.id)}
          >
            <Hash className="w-5 h-5" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#313338] hover:bg-emerald-600 text-emerald-500"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-[#2B2D31] flex flex-col">
        <div className="p-4 border-b border-[#1F2023] shadow">
          <h2 className="font-semibold text-white">Channels</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-[2px]">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                className="w-full justify-start text-[#949BA4] hover:text-white"
                onClick={() => setSelectedChannel(channel.id)}
              >
                <Hash className="w-4 h-4 mr-2" />
                {channel.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 bg-[#232428] mt-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {session?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">
                {session?.user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-[#949BA4]">Online</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#313338]">
        {/* Channel Header */}
        <div className="h-12 border-b border-[#1F2023] flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-[#949BA4]" />
            <h3 className="font-semibold text-white">
              {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3 group">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.sender?.avatar_url} />
                  <AvatarFallback>
                    {message.sender?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-white">
                      {message.sender?.username}
                    </span>
                    <span className="text-xs text-[#949BA4]">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[#DBDEE1]">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Message #general"
              className="bg-[#383A40] border-none text-white placeholder:text-[#949BA4]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <PlusCircle className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <Gift className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <ImagePlus className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-[#949BA4] hover:text-white">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-60 bg-[#2B2D31] p-4">
        <h3 className="text-[#949BA4] font-semibold mb-4">Online</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {session?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[#949BA4]">
              {session?.user?.email?.split("@")[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
