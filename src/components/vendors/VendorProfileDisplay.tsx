import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Star, Store, Palette, Plus, Video, FileText, Book, Headphones, BookOpen, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileBanner from "../profile/ProfileBanner";
import ProfileAvatar from "../profile/ProfileAvatar";
import { useSession } from "@supabase/auth-helpers-react";

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

const VendorProfileDisplay = ({ vendorData }: VendorProfileDisplayProps) => {
  const session = useSession();
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const sidebarItems = [
    { icon: <Video className="w-4 h-4" />, label: "Videos" },
    { icon: <Store className="w-4 h-4" />, label: "Clothing" },
    { icon: <FileText className="w-4 h-4" />, label: "PDFs" },
    { icon: <Book className="w-4 h-4" />, label: "Books" },
    { icon: <Headphones className="w-4 h-4" />, label: "Podcasts" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Ebooks" },
    { icon: <Video className="w-4 h-4" />, label: "Lives" },
    { icon: <Image className="w-4 h-4" />, label: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner and Profile Section */}
      <div className="relative">
        <ProfileBanner defaultBannerUrl={profile?.default_banner_url} />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
          <div className="container mx-auto flex items-end gap-6">
            <ProfileAvatar 
              avatarUrl={profile?.avatar_url}
              fullName={profile?.full_name}
              username={profile?.username}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile?.full_name || "Your Name"}</h1>
              <p className="text-white/80">@{profile?.username}</p>
              <p className="text-white/60 mt-2">{vendorData.aboutMe || "Add short sentence about your values"}</p>
            </div>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 space-y-6">
            {/* Store Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Store</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Product cards would go here */}
                  <Card className="bg-card/50">
                    <CardContent className="p-4 text-center">
                      <Button variant="ghost" className="w-full h-32 border-2 border-dashed">
                        <Plus className="w-6 h-6" />
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">Add your first product</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDisplay;