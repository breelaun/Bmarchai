import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  username: string;
}

const ProfileAvatar = ({ avatarUrl, fullName, username }: ProfileAvatarProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;

    if (file.size > 5000000) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });

      // Force a page reload to show the new avatar
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="w-32 h-32 border-4 border-background">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
          {fullName?.charAt(0) || username?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <Button 
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
        disabled={isUploading}
      >
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
          <Edit className="w-4 h-4 text-primary-foreground" />
        </label>
      </Button>
    </div>
  );
};

export default ProfileAvatar;