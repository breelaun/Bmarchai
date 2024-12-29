import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorProfileDisplayProps {
  vendorData: {
    template: string;
    displayStyle: string;
    bentoStyle: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
    aboutMe: string;
    enableReviews: boolean;
    enableFeatured: boolean;
  };
}

const VendorProfileDisplay = ({ vendorData }: VendorProfileDisplayProps) => {
  const getTemplateTitle = (template: string) => {
    const titles: Record<string, string> = {
      classic: "Classic Elegance",
      bold: "Bold & Modern",
      minimalist: "Minimalist Chic",
      vintage: "Vintage Vibes",
      playful: "Playful Pop",
      luxury: "Luxury Boutique",
      sport: "Sport & Active",
      tech: "Tech Modern",
    };
    return titles[template] || template;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            Vendor Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Template Style</h3>
            <p className="text-muted-foreground">{getTemplateTitle(vendorData.template)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Display Settings</h3>
            <p className="text-muted-foreground">Product Display: {vendorData.displayStyle}</p>
            <p className="text-muted-foreground">Bento Layout: {vendorData.bentoStyle}</p>
          </div>

          {vendorData.aboutMe && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{vendorData.aboutMe}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Social Links</h3>
            <div className="flex gap-4">
              {vendorData.socialLinks.facebook && (
                <Button variant="outline" size="icon" asChild>
                  <a href={vendorData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {vendorData.socialLinks.instagram && (
                <Button variant="outline" size="icon" asChild>
                  <a href={vendorData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {vendorData.socialLinks.twitter && (
                <Button variant="outline" size="icon" asChild>
                  <a href={vendorData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {vendorData.enableReviews && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Reviews Enabled</span>
              </div>
            )}
            {vendorData.enableFeatured && (
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <span className="text-sm">Featured Products Enabled</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfileDisplay;