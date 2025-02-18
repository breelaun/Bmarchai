import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdList } from "./AdList";
import { AdForm } from "./AdForm";
import { Card, CardContent } from "@/components/ui/card";
import { Advertisement } from "../types";

export const AdManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

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

          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <ScrollArea className="h-full max-h-[calc(80vh-4rem)] pr-4">
              <AdForm
                initialData={selectedAd}
                onSuccess={handleDialogClose}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};