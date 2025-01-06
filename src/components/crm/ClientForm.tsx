import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiField } from "./MultiField";
import { SocialLinksFields } from "./SocialLinksFields";
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
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // Filter out empty emails and phones
      const filteredEmails = data.emails.filter(email => email.trim() !== "");
      const filteredPhones = data.phones.filter(phone => phone.trim() !== "");
      
      // Filter out empty social links
      const socialLinks = Object.fromEntries(
        Object.entries(data.socialLinks).filter(([_, value]) => value && value.trim() !== "")
      );

      const { error } = await supabase.from("crm_clients").insert([
        {
          name: data.name,
          company: data.company,
          website: data.website,
          emails: filteredEmails,
          phone: filteredPhones[0], // Keep backward compatibility with existing phone field
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

  const addField = (fieldName: 'emails' | 'phones') => {
    const currentFields = form.getValues(fieldName) || [];
    if (currentFields.length < 3) {
      form.setValue(fieldName, [...currentFields, '']);
    }
  };

  const removeField = (fieldName: 'emails' | 'phones', index: number) => {
    const currentFields = form.getValues(fieldName) || [];
    form.setValue(
      fieldName,
      currentFields.filter((_, i) => i !== index)
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Add New Client</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="contactType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <FormLabel>Social Media Links</FormLabel>
              <SocialLinksFields form={form} />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </SheetContent>
    </Sheet>
  );
}