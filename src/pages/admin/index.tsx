import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtsSection } from "@/components/admin/ArtsSection";
import { AdManager } from "@/components/admin/advertisements/AdManager";
import { YouTubeEmbedsManager } from "@/components/admin/YouTubeEmbedsManager";

const AdminPage = () => {
  return (
    <div className="container py-8">
      <Tabs defaultValue="arts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="arts">Arts Management</TabsTrigger>
          <TabsTrigger value="ads">Advertisement Management</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Embeds</TabsTrigger>
        </TabsList>

        <TabsContent value="arts">
          <ArtsSection />
        </TabsContent>

        <TabsContent value="ads">
          <AdManager />
        </TabsContent>

        <TabsContent value="youtube">
          <YouTubeEmbedsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;