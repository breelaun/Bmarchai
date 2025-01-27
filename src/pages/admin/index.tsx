import { Card } from "@/components/ui/card";
import ArtsSection from "@/components/admin/ArtsSection";
import YouTubeEmbedsManager from "@/components/admin/YouTubeEmbedsManager";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <Card className="p-6">
          <ArtsSection />
        </Card>

        <Card className="p-6">
          <YouTubeEmbedsManager />
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;