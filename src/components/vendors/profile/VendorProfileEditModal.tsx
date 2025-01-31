import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { timezones } from "@/lib/timezones";
import { countries } from "@/lib/countries";
import type { VendorProfileData } from "@/components/types/vendor-setup";

interface VendorProfileEditModalProps {
  vendorId: string;
  initialData?: VendorProfileData;
  onSuccess?: () => void;
}

export function VendorProfileEditModal({ vendorId, initialData, onSuccess }: VendorProfileEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<VendorProfileData>({
    defaultValues: {
      business_name: initialData?.business_name || "",
      business_description: initialData?.business_description || "",
      contact_email: initialData?.contact_email || "",
      social_links: initialData?.social_links || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      timezone: initialData?.timezone || "America/New_York",
      country: initialData?.country || "",
    },
  });

  const onSubmit = async (data: VendorProfileData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          business_name: data.business_name,
          business_description: data.business_description,
          contact_email: data.contact_email,
          social_links: data.social_links,
          timezone: data.timezone,
          country: data.country,
        })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor profile updated successfully",
      });
      
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Vendor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                {...register("business_name", { required: "Business name is required" })}
              />
              {errors.business_name && (
                <p className="text-sm text-red-500">{errors.business_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="business_description">Description</Label>
              <Textarea
                id="business_description"
                {...register("business_description")}
                rows={4}
              />
            </div>

            <div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  onValueChange={(value) => register("timezone").onChange({ target: { value } })}
                  defaultValue={initialData?.timezone || "America/New_York"}
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

              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={(value) => register("country").onChange({ target: { value } })}
                  defaultValue={initialData?.country}
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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}