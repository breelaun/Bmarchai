import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SessionFormatControlsProps {
  form: any;
  sessionFormat: 'live' | 'embed' | 'product';
}

export function SessionFormatControls({ form, sessionFormat }: SessionFormatControlsProps) {
  if (sessionFormat === 'live') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Camera Controls</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.watch('cameraConfig.front')}
                  onCheckedChange={(checked) => 
                    form.setValue('cameraConfig.front', checked)
                  }
                />
                <Label>Front Camera</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.watch('cameraConfig.rear')}
                  onCheckedChange={(checked) => 
                    form.setValue('cameraConfig.rear', checked)
                  }
                />
                <Label>Rear Camera</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionFormat === 'embed') {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="embedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embed URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter embed URL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Camera Overlay</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch('cameraConfig.enabled')}
              onCheckedChange={(checked) => 
                form.setValue('cameraConfig.enabled', checked)
              }
            />
            <Label>Enable Camera</Label>
          </div>
        </div>
      </div>
    );
  }

  if (sessionFormat === 'product') {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="productUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Media URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter product media URL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Camera Settings</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch('cameraConfig.enabled')}
              onCheckedChange={(checked) => 
                form.setValue('cameraConfig.enabled', checked)
              }
            />
            <Label>Enable Camera</Label>
          </div>
        </div>
      </div>
    );
  }

  return null;
}