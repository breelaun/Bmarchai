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
  Camera, 
  CameraOff,
  Users,
  ScreenShare,
  ScreenShareOff,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import type { Channel } from '../types';
import ProductsList from './ProductsList';

interface LiveSessionProps {
  channel: Channel;
}

const LiveSession = ({ channel }: LiveSessionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  const { data: activeSession, isLoading } = useQuery({
    queryKey: ['live-session', channel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_live_sessions')
        .select('*')
        .eq('channel_id', channel.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!channel.id,
  });

  const { data: participant } = useQuery({
    queryKey: ['session-participant', activeSession?.id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id || !activeSession?.id) return null;

      const { data, error } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', activeSession.id)
        .eq('user_id', user.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!activeSession?.id,
  });

  const toggleScreenShare = useMutation({
    mutationFn: async () => {
      if (!participant?.id) return;
      
      const { error } = await supabase
        .from('session_participants')
        .update({ screen_share_enabled: !isScreenSharing })
        .eq('id', participant.id);

      if (error) throw error;
      setIsScreenSharing(!isScreenSharing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-participant'] });
      toast({
        title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      });
    },
  });

  const handleTip = async (amount: number) => {
    if (!participant?.id) return;

    try {
      const { error } = await supabase
        .from('session_participants')
        .update({
          tip_amount: amount,
        })
        .eq('id', participant.id);

      if (error) throw error;

      toast({
        title: "Thank you for your tip!",
        description: `You tipped $${amount.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Error sending tip:', error);
      toast({
        title: "Error",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const handleStartSession = async () => {
    // Implementation for starting a new session will go here
    setIsPlaying(true);
  };

  if (!activeSession) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Video className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No active live session at the moment.
            </p>
            <Button 
              onClick={handleStartSession}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Start Live Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span>Live Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={isMicOn ? 'bg-primary/10' : ''}
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
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={isCameraOn ? 'bg-primary/10' : ''}
              >
                {isCameraOn ? (
                  <Camera className="h-4 w-4" />
                ) : (
                  <CameraOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleScreenShare.mutate()}
                className={isScreenSharing ? 'bg-primary/10' : ''}
                disabled={!participant?.can_share_screen}
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
                onClick={() => setIsPlaying(!isPlaying)}
                className={isPlaying ? 'bg-primary/10' : ''}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowProducts(!showProducts)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {channel.stream_config?.embed_url && (
            <div className="aspect-video rounded-lg overflow-hidden border border-border">
              <iframe
                src={channel.stream_config.embed_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Session started: {new Date(activeSession.started_at).toLocaleString()}
            </p>
            {activeSession.metadata?.viewers && (
              <p className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {activeSession.metadata.viewers} viewers
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleTip(5)}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Tip $5
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTip(10)}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Tip $10
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTip(20)}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Tip $20
            </Button>
          </div>
        </CardContent>
      </Card>

      {showProducts && (
        <ProductsList
          products={channel.active_products || []}
          session={activeSession}
          isMobile={false}
          showProducts={showProducts}
          channelId={channel.id}
        />
      )}
    </div>
  );
};

export default LiveSession;