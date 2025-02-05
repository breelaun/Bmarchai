import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { timezones } from "@/lib/timezones";
import { countries } from "@/lib/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VendorProfileFormData {
  business_name: string;
  business_description: string;
  contact_email: string;
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  locations: { address: string; city: string; state: string; country: string }[];
  timezone: string;
  country: string;
  business_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  website_url: string;
  current_sale: {
    title: string;
    image_url: string | null;
  };
}

interface VendorProfileFormProps {
  initialData?: Partial<VendorProfileFormData>;
  onSuccess?: () => void;
}

export default function VendorProfileForm({ initialData, onSuccess }: VendorProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleImage, setSaleImage] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<VendorProfileFormData>({
    defaultValues: {
      business_name: initialData?.business_name || "",
      business_description: initialData?.business_description || "",
      contact_email: initialData?.contact_email || "",
      social_links: initialData?.social_links || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      locations: initialData?.locations || [{ address: "", city: "", state: "", country: "" }],
      timezone: initialData?.timezone || "America/New_York",
      country: initialData?.country || "",
      business_hours: initialData?.business_hours || {
        monday: { open: "09:00", close: "17:00" },
        tuesday: { open: "09:00", close: "17:00" },
        wednesday: { open: "09:00", close: "17:00" },
        thursday: { open: "09:00", close: "17:00" },
        friday: { open: "09:00", close: "17:00" },
        saturday: { open: "09:00", close: "17:00" },
        sunday: { open: "09:00", close: "17:00" },
      },
      website_url: initialData?.website_url || "",
      current_sale: initialData?.current_sale || {
        title: "",
        image_url: null,
      },
    },
  });

  const handleSaleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('sale-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error uploading image",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('sale-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: VendorProfileFormData) => {
    try {
      setIsSubmitting(true);

      let saleImageUrl = data.current_sale.image_url;
      if (saleImage) {
        saleImageUrl = await handleSaleImageUpload(saleImage);
      }

      const { error } = await supabase
        .from('vendor_profiles')
        .update({
          business_name: data.business_name,
          business_description: data.business_description,
          contact_email: data.contact_email,
          social_links: data.social_links,
          locations: data.locations,
          timezone: data.timezone,
          country: data.country,
          business_hours: data.business_hours,
          website_url: data.website_url,
          current_sale: {
            title: data.current_sale.title,
            image_url: saleImageUrl,
          },
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      
      toast({
        title: "Profile updated",
        description: "Your vendor profile has been updated successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              {...register("business_name", { required: "Business name is required" })}
            />
            {errors.business_name && (
              <p className="text-sm text-red-500">{errors.business_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Description</Label>
            <Textarea
              id="business_description"
              {...register("business_description")}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              {...register("contact_email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.contact_email && (
              <p className="text-sm text-red-500">{errors.contact_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Social Links</Label>
            <div className="space-y-4">
              <Input
                placeholder="Facebook URL"
                {...register("social_links.facebook")}
              />
              <Input
                placeholder="Instagram URL"
                {...register("social_links.instagram")}
              />
              <Input
                placeholder="Twitter URL"
                {...register("social_links.twitter")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              {...register("website_url")}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="space-y-4">
              <Input
                placeholder="Address"
                {...register("locations.0.address")}
              />
              <Input
                placeholder="City"
                {...register("locations.0.city")}
              />
              <Input
                placeholder="State"
                {...register("locations.0.state")}
              />
              <Input
                placeholder="Country"
                {...register("locations.0.country")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                defaultValue={initialData?.timezone || "America/New_York"}
                onValueChange={(value) => register("timezone").onChange({ target: { value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                defaultValue={initialData?.country}
                onValueChange={(value) => register("country").onChange({ target: { value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Hours</Label>
            {Object.keys(initialData?.business_hours || {}).map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <span className="capitalize">{day}</span>
                <Input
                  type="time"
                  {...register(`business_hours.${day}.open` as any)}
                />
                <Input
                  type="time"
                  {...register(`business_hours.${day}.close` as any)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Current Sale</Label>
            <Input
              placeholder="Sale Title"
              {...register("current_sale.title")}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSaleImage(file);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
