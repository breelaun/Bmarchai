import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MultiField } from "./MultiField";
import { SocialLinksFields } from "./SocialLinksFields";
import { ContactInfoFields } from "./form-sections/ContactInfoFields";
import { NotesField } from "./form-sections/NotesField";
import { FormActions } from "./form-sections/FormActions";
import { useClientSubmit } from "./form-handlers/useClientSubmit";
import type { ClientFormData } from "./types";

export function ClientForm() {
  const [open, setOpen] = useState(false);

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

  const { handleSubmit, isSubmitting } = useClientSubmit(form, () => setOpen(false));

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            <ContactInfoFields form={form} />

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

            <NotesField form={form} />

            <FormActions 
              isSubmitting={isSubmitting}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}