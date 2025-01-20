import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientList from "@/components/crm/ClientList";
import TaskList from "@/components/crm/TaskList";
import AnalyticsDashboard from "@/components/crm/analytics/AnalyticsDashboard";
import DocumentEditor from "@/components/crm/DocumentEditor";
import FinancialEditor from "@/components/crm/FinancialEditor";
import { Loader2 } from "lucide-react";
import { Chart, Line } from "react-chartjs-2";
import "chart.js/auto";

const CRMPage = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState("AAPL"); // Default stock symbol
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "0WScaBkGdu3zN_9W6rNLYA1UgWcZ9cvN"; // Polygon API key

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-01-01/2023-12-31?adjusted=true&sort=asc&apiKey=${API_KEY}`
        );
        if (!response.ok) throw new Error("Error fetching stock data");
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          throw new Error("No data available for this symbol");
        }

        const labels = data.results.map((item) =>
          new Date(item.t).toLocaleDateString()
        );
        const prices = data.results.map((item) => item.c);

        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Stock Price`,
              data: prices,
              borderColor: "blue",
              borderWidth: 2,
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (!session) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>
      <Tabs defaultValue="analytics" className="min-h-[calc(100vh-8rem)]">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-full rounded-md">
          <TabsContent value="analytics" className="mt-0 p-4">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="clients" className="mt-0 p-4">
            <ClientList />
          </TabsContent>
          <TabsContent value="tasks" className="mt-0 p-4">
            <TaskList />
          </TabsContent>
          <TabsContent value="stocks" className="mt-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter Stock Symbol"
                  className="border p-2 rounded-md"
                />
                <button
                  onClick={() => setSymbol(symbol)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Fetch
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                chartData && (
                  <div>
                    <Line data={chartData} />
                  </div>
                )
              )}
            </div>
          </TabsContent>
          <TabsContent value="docs" className="mt-0 p-4">
            <DocumentEditor />
          </TabsContent>
          <TabsContent value="finance" className="mt-0 p-4">
            <FinancialEditor />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CRMPage;
