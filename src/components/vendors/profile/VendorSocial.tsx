import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface VendorSocialProps {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const VendorSocial = ({ socialLinks }: VendorSocialProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {socialLinks.facebook && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.instagram && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorSocial;