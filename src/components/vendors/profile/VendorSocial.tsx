import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Edit2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VendorSocialProps {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  vendorId?: string;
}

const VendorSocial = ({ socialLinks, vendorId }: VendorSocialProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState(socialLinks);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!vendorId) return;

    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .update({ social_links: links })
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social links updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update social links",
      });
    }
  };

  const placeholderLinks = {
    facebook: "https://facebook.com/your-page",
    instagram: "https://instagram.com/your-handle",
    twitter: "https://twitter.com/your-handle"
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Social Links</CardTitle>
        {vendorId && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Facebook className="h-4 w-4" />
              <Input
                value={links.facebook}
                onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                placeholder={placeholderLinks.facebook}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Instagram className="h-4 w-4" />
              <Input
                value={links.instagram}
                onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                placeholder={placeholderLinks.instagram}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Twitter className="h-4 w-4" />
              <Input
                value={links.twitter}
                onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                placeholder={placeholderLinks.twitter}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            {links.facebook && (
              <Button variant="outline" size="icon" asChild>
                <a href={links.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            )}
            {links.instagram && (
              <Button variant="outline" size="icon" asChild>
                <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            )}
            {links.twitter && (
              <Button variant="outline" size="icon" asChild>
                <a href={links.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorSocial;