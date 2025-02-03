import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SessionCreationFormProps {
  onSubmit: (sessionData: any) => void;
  onClose: () => void;
}

const SessionCreationForm = ({ onSubmit, onClose }: SessionCreationFormProps) => {
  const [sessionType, setSessionType] = useState<'free' | 'paid'>('free');
  const [sessionPrice, setSessionPrice] = useState<number>(0);
  const [sessionName, setSessionName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [sessionFormat, setSessionFormat] = useState<'live' | 'embed' | 'product'>('live');
  const [duration, setDuration] = useState('60');
  const [description, setDescription] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [cameraPreference, setCameraPreference] = useState({
    front: false,
    rear: false
  });

  const handleSubmit = () => {
    const sessionData = {
      name: sessionName,
      session_type: sessionType,
      price: sessionType === 'paid' ? sessionPrice : 0,
      is_private: isPrivate,
      format: sessionFormat,
      duration: `${duration} minutes`,
      description,
      embed_url: sessionFormat === 'embed' ? embedUrl : null,
      camera_config: {
        front: cameraPreference.front,
        rear: cameraPreference.rear
      },
      start_time: new Date().toISOString(),
    };

    onSubmit(sessionData);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Session</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="sessionName">Session Name</Label>
            <Input
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Session description"
            />
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup value={sessionType} onValueChange={(value: 'free' | 'paid') => setSessionType(value)}>
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

          {sessionType === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                value={sessionPrice}
                onChange={(e) => setSessionPrice(Number(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
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
            <RadioGroup value={sessionFormat} onValueChange={(value: 'live' | 'embed' | 'product') => setSessionFormat(value)}>
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

          {sessionFormat === 'live' && (
            <div className="space-y-2">
              <Label>Camera Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={cameraPreference.front}
                    onCheckedChange={(checked) => setCameraPreference(prev => ({ ...prev, front: checked }))}
                  />
                  <Label>Front Camera</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={cameraPreference.rear}
                    onCheckedChange={(checked) => setCameraPreference(prev => ({ ...prev, rear: checked }))}
                  />
                  <Label>Rear Camera</Label>
                </div>
              </div>
            </div>
          )}

          {sessionFormat === 'embed' && (
            <div className="space-y-2">
              <Label htmlFor="embedUrl">Embed URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Enter embed URL"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              id="private"
            />
            <Label htmlFor="private">Private Session</Label>
          </div>
        </div>
      </ScrollArea>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Session</Button>
      </div>
    </DialogContent>
  );
};

export default SessionCreationForm;