import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClientFormData = {
  name: string;
  company?: string;
  website?: string;
  emails: string[];
  phones: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  notes?: string;
  contactType: 'client' | 'contact' | 'lead';
};

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
    const currentFields = form.getValues(fieldName);
    if (currentFields.length < 3) {
      form.setValue(fieldName, [...currentFields, '']);
    }
  };

  const removeField = (fieldName: 'emails' | 'phones', index: number) => {
    const currentFields = form.getValues(fieldName);
    form.setValue(
      fieldName,
      currentFields.filter((_, i) => i !== index)
    );
  };

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

            {/* Multiple Emails */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Email Addresses</FormLabel>
                {form.watch('emails').length < 3 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => addField('emails')}>
                    <Plus className="h-4 w-4 mr-1" /> Add Email
                  </Button>
                )}
              </div>
              {form.watch('emails').map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`emails.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField('emails', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Multiple Phone Numbers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Phone Numbers</FormLabel>
                {form.watch('phones').length < 3 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => addField('phones')}>
                    <Plus className="h-4 w-4 mr-1" /> Add Phone
                  </Button>
                )}
              </div>
              {form.watch('phones').map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`phones.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField('phones', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="space-y-2">
              <FormLabel>Social Media Links</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="socialLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="LinkedIn" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Twitter" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Facebook" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Instagram" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
      </DialogContent>
    </Dialog>
  );
}