import React from 'react';
import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionFormatControls } from './SessionFormatControls';

interface SessionCreationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

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

export default function SessionCreationForm({ onSubmit, onClose }: SessionCreationFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      sessionType: 'free',
      price: 0,
      isPrivate: false,
      sessionFormat: 'live',
      duration: '60',
      embedUrl: '',
      productUrl: '',
      cameraConfig: {
        front: false,
        rear: false,
        enabled: false
      }
    }
  });

  const handleSubmit = (data: FormValues) => {
    const sessionData = {
      ...data,
      price: data.sessionType === 'free' ? 0 : Number(data.price),
      // Convert minutes to proper interval format
      duration: `${data.duration} minutes`,
    };
    onSubmit(sessionData);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Session</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] pr-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="sessionName">Session Name</Label>
            <Input
              id="sessionName"
              {...form.register('name')}
              placeholder="Enter session name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Session description"
            />
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup
              value={form.watch('sessionType')}
              onValueChange={(value: 'free' | 'paid') => form.setValue('sessionType', value)}
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
          </div>

          {form.watch('sessionType') === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...form.register('price')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select 
              value={form.watch('duration')} 
              onValueChange={(value) => form.setValue('duration', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Session Format</Label>
            <RadioGroup
              value={form.watch('sessionFormat')}
              onValueChange={(value: SessionFormat) => 
                form.setValue('sessionFormat', value)
              }
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
          </div>

          <SessionFormatControls 
            form={form} 
            sessionFormat={form.watch('sessionFormat')}
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch('isPrivate')}
              onCheckedChange={(checked) => form.setValue('isPrivate', checked)}
              id="private"
            />
            <Label htmlFor="private">Private Session</Label>
          </div>
        </form>
      </ScrollArea>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={form.handleSubmit(handleSubmit)}>Create Session</Button>
      </div>
    </DialogContent>
  );
}