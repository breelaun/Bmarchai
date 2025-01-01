import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Star, Store, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VendorProfileDisplayProps {
  vendorData: {
    template: number | null;
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

interface TemplateStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  font: string;
}

interface TemplateData {
  id: number;
  name: string;
  description: string | null;
  style_config: TemplateStyleConfig;
}

const VendorProfileDisplay = ({ vendorData }: VendorProfileDisplayProps) => {
  const { data: template } = useQuery({
    queryKey: ['vendorTemplate', vendorData.template],
    queryFn: async () => {
      if (!vendorData.template) return null;
      
      const { data, error } = await supabase
        .from('vendor_templates')
        .select('*')
        .eq('id', vendorData.template)
        .maybeSingle();

      if (error) throw error;
      
      // Type guard to validate the style config structure
      const isValidStyleConfig = (config: any): config is TemplateStyleConfig => {
        return (
          config &&
          config.colors &&
          typeof config.colors.primary === 'string' &&
          typeof config.colors.secondary === 'string' &&
          typeof config.colors.background === 'string' &&
          typeof config.font === 'string'
        );
      };

      if (data && isValidStyleConfig(data.style_config)) {
        return {
          ...data,
          style_config: data.style_config as TemplateStyleConfig,
        } as TemplateData;
      }
      
      throw new Error("Invalid template data structure");
    },
    enabled: !!vendorData.template
  });

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
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <p className="text-muted-foreground">
                {template?.name || "No template selected"}
              </p>
            </div>
            {template?.style_config && (
              <div className="mt-2 flex gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: template.style_config.colors.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: template.style_config.colors.secondary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: template.style_config.colors.background }}
                />
              </div>
            )}
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