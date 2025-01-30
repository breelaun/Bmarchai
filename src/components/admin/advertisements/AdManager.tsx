import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AdList } from "./AdList";
import { AdForm } from "./AdForm";
import { Card, CardContent } from "@/components/ui/card";

export const AdManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Ads</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <DialogTrigger>
                <AdList onCreateClick={() => setIsDialogOpen(true)} />
              </DialogTrigger>
            </div>

            <TabsContent value="all" className="space-y-4">
              <AdList />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <AdList filter="active" />
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <AdList filter="scheduled" />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <AdList filter="completed" />
            </TabsContent>
          </Tabs>

          <DialogContent className="sm:max-w-[600px]">
            <AdForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};