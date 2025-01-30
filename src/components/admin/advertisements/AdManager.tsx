import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdList } from "./AdList";
import { Card, CardContent } from "@/components/ui/card";

export const AdManager = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Ads</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <AdList />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <AdList />
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <AdList />
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <AdList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};