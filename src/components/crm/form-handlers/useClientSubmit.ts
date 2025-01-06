import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ClientFormData } from "../types";

export const useClientSubmit = (
  form: UseFormReturn<ClientFormData>,
  onSuccess: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to add clients");
      }

      const filteredEmails = data.emails.filter(email => email.trim() !== "");
      const filteredPhones = data.phones.filter(phone => phone.trim() !== "");
      
      const socialLinks = Object.fromEntries(
        Object.entries(data.socialLinks).filter(([_, value]) => value && value.trim() !== "")
      );

      let website = data.website;
      if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = `https://${website}`;
      }

      const { error } = await supabase.from("crm_clients").insert([
        {
          vendor_id: user.id,
          name: data.name,
          company: data.company,
          website: website,
          emails: filteredEmails,
          phone: filteredPhones[0],
          social_links: socialLinks,
          notes: data.notes,
          contact_type: data.contactType,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client has been added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};