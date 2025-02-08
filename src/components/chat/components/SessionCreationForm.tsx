
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionFormatControls } from './SessionFormatControls';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

type SessionFormat = 'live' | 'embed' | 'product';

interface FormValues {
  name: string;
  description: string;
  sessionType: 'free' | 'paid';
  price: number;
  isPrivate: boolean;
  sessionFormat: SessionFormat;
  duration: string;
  embedUrl: string;
  productUrl: string;
  cameraConfig: {
    front: boolean;
    rear: boolean;
    enabled: boolean;
  };
}

interface SessionCreationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  form: UseFormReturn<FormValues>;
}

export default function SessionCreationForm({ onSubmit, onClose, form }: SessionCreationFormProps) {
  const handleSubmit = (data: FormValues) => {
    const sessionData = {
      ...data,
      price: data.sessionType === 'free' ? 0 : Number(data.price),
      duration: `${data.duration} minutes`,
      camera_config: data.cameraConfig
    };
    onSubmit(sessionData);
  };

  return (
    <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Create New Session</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 py-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter session name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Session description" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sessionType"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Session Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="free" id="free" />
                            <Label htmlFor="free">Free Session</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paid" id="paid" />
                            <Label htmlFor="paid">Paid Session</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('sessionType') === 'paid' && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Format *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="live" id="live" />
                            <Label htmlFor="live">Live Stream</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="embed" id="embed" />
                            <Label htmlFor="embed">Embedded Content</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="product" id="product" />
                            <Label htmlFor="product">Product Showcase</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <SessionFormatControls 
                  form={form} 
                  sessionFormat={form.watch('sessionFormat')}
                />

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Private Session</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={form.handleSubmit(handleSubmit)}>Create Session</Button>
      </div>
    </DialogContent>
  );
}
