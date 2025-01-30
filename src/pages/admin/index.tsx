import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtsSection } from "@/components/admin/ArtsSection";
import { AdManager } from "@/components/admin/advertisements/AdManager";

const AdminPage = () => {
  return (
    <div className="container py-8">
      <Tabs defaultValue="arts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="arts">Arts Management</TabsTrigger>
          <TabsTrigger value="ads">Advertisement Management</TabsTrigger>
        </TabsList>

        <TabsContent value="arts">
          <ArtsSection />
        </TabsContent>

        <TabsContent value="ads">
          <AdManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;