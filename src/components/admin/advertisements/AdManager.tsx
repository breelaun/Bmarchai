import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdList } from "./AdList";
import { AdForm } from "./AdForm";
import { Card, CardContent } from "@/components/ui/card";
import { Advertisement } from "../types";
import { GripVertical } from "lucide-react";

export const AdManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [dialogPosition, setDialogPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleEditClick = (ad: Advertisement) => {
    setSelectedAd(ad);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedAd(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAd(null);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.dialog-content')) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - dialogPosition.x,
      y: e.clientY - dialogPosition.y,
    };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;

    // Constrain to window bounds
    const maxX = window.innerWidth - 600; // dialog width
    const maxY = window.innerHeight - 400; // approximate dialog height

    setDialogPosition({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add drag event listeners
  useState(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  return (
    <Card>
      <CardContent className="p-6">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Ads</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              <AdList
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
              />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <AdList
                filter="active"
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
              />
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <AdList
                filter="scheduled"
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <AdList
                filter="completed"
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
              />
            </TabsContent>
          </Tabs>

          <DialogContent 
            className="sm:max-w-[600px] cursor-move"
            style={{ 
              position: 'fixed',
              left: `${dialogPosition.x}px`,
              top: `${dialogPosition.y}px`,
              transform: 'none'
            }}
            onMouseDown={handleDragStart}
          >
            <div className="absolute left-0 top-0 h-6 w-full flex items-center justify-start pl-2 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="dialog-content pt-4">
              <AdForm
                initialData={selectedAd}
                onSuccess={handleDialogClose}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};