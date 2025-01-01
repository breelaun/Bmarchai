import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

interface VendorHeaderProps {
  vendor: any;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
}

const VendorHeader = ({ vendor, theme }: VendorHeaderProps) => {
  const socialLinks = vendor.social_links || {};

  return (
    <header
      className="py-12 px-6"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {vendor.profiles?.avatar_url && (
            <img
              src={vendor.profiles.avatar_url}
              alt={vendor.business_name}
              className="w-32 h-32 rounded-full object-cover border-4"
              style={{ borderColor: theme.secondaryColor }}
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2" style={{ color: theme.secondaryColor }}>
              {vendor.business_name}
            </h1>
            <p className="text-lg mb-4" style={{ color: theme.secondaryColor }}>
              {vendor.business_description}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {socialLinks.facebook && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    color: theme.primaryColor 
                  }}
                >
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks.instagram && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    color: theme.primaryColor 
                  }}
                >
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks.twitter && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    color: theme.primaryColor 
                  }}
                >
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {vendor.contact_email && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    color: theme.primaryColor 
                  }}
                >
                  <a href={`mailto:${vendor.contact_email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;