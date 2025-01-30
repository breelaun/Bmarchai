import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { MultiField } from "./MultiField";
import { SocialLinksFields } from "./SocialLinksFields";
import { LeadFields } from "./LeadFields";
import { BasicInfoFields } from "./forms/BasicInfoFields";
import { ContactTypeField } from "./forms/ContactTypeField";
import { NotesField } from "./forms/NotesField";
import type { ClientFormData } from "./types";

export function ClientForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    defaultValues: {
      name: "",
      company: "",
      website: "",
      emails: [""],
      phones: [""],
      socialLinks: {
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
      },
      notes: "",
      contactType: "lead",
      lead_stage: "new",
      lead_temperature: "warm",
      probability: 0,
    },
  });

  const addField = (fieldName: 'emails' | 'phones') => {
    const currentValues = form.getValues(fieldName);
    if (currentValues.length < 3) {
      form.setValue(fieldName, [...currentValues, '']);
    }
  };

  const removeField = (fieldName: 'emails' | 'phones', index: number) => {
    const currentValues = form.getValues(fieldName);
    form.setValue(
      fieldName,
      currentValues.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const filteredEmails = data.emails.filter(email => email.trim() !== "");
      const filteredPhones = data.phones.filter(phone => phone.trim() !== "");
      const socialLinks = Object.fromEntries(
        Object.entries(data.socialLinks).filter(([_, value]) => value && value.trim() !== "")
      );

      const { error } = await supabase.from("crm_clients").insert([
        {
          name: data.name,
          company: data.company,
          website: data.website,
          emails: filteredEmails,
          phone: filteredPhones[0],
          social_links: socialLinks,
          notes: data.notes,
          contact_type: data.contactType,
          lead_source_id: data.lead_source_id,
          lead_stage: data.lead_stage,
          lead_temperature: data.lead_temperature,
          expected_value: data.expected_value,
          probability: data.probability,
          next_follow_up: data.next_follow_up,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client has been added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactType = form.watch("contactType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ContactTypeField form={form} />
            <BasicInfoFields form={form} />
            
            <MultiField
              fieldName="emails"
              label="Email Addresses"
              values={form.watch('emails') || []}
              onAdd={addField}
              onRemove={removeField}
              form={form}
              type="email"
            />

            <MultiField
              fieldName="phones"
              label="Phone Numbers"
              values={form.watch('phones') || []}
              onAdd={addField}
              onRemove={removeField}
              form={form}
              type="tel"
            />

            <div className="space-y-2">
              <SocialLinksFields form={form} />
            </div>

            {contactType === "lead" && <LeadFields form={form} />}

            <NotesField form={form} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Client
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}