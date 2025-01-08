import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ImageIcon, Link as LinkIcon } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VendorStore = () => {
  const session = useSession();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [promoText, setPromoText] = useState("");
  const [promoLink, setPromoLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('products')
        .upload(`promo/${fileName}`, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(`promo/${fileName}`);

      setImageUrl(urlData.publicUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Promo</CardTitle>
          {session && (
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Plus className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Promo"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById("promo-image")?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                id="promo-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Input
              placeholder="Promo text (e.g., '20% off all products this week!')"
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Link URL (optional)"
                value={promoLink}
                onChange={(e) => setPromoLink(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="relative h-[200px] overflow-hidden rounded-lg">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Promo"
                  className="w-full h-full object-cover"
                />
                {promoText && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <a
                      href={promoLink || "#"}
                      target={promoLink ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-white text-2xl font-bold text-center px-4 hover:underline"
                    >
                      {promoText}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">
                  {session ? "Add a promotional image and text" : "No promotion available"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorStore;