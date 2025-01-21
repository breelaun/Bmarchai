import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCards } from "./components/StatCards";
import { FinancialOverview } from "./components/FinancialOverview";
import { TopProducts } from "./components/TopProducts";
import { VideoAnalytics } from "./components/VideoAnalytics";

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-4">
      <StatCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinancialOverview />
        <TopProducts />
      </div>
      <VideoAnalytics />
    </div>
  );
};

export default AnalyticsDashboard;