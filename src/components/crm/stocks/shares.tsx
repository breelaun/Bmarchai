import { useEffect, useState } from "react";
import { Chart, Line } from "react-chartjs-2";
import "chart.js/auto";

const Shares = () => {
  const [symbol, setSymbol] = useState("AAPL"); // Default stock symbol
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "0WScaBkGdu3zN_9W6rNLYA1UgWcZ9cvN"; // Polygon API key

  const fetchStockData = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-01-01/2023-12-31?adjusted=true&sort=asc&apiKey=${API_KEY}`
      );
      if (!response.ok) throw new Error("Error fetching data");
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const labels = data.results.map((item: any) =>
          new Date(item.t).toLocaleDateString()
        );
        const prices = data.results.map((item: any) => item.c);

        return { labels, prices };
      } else {
        throw new Error("No data found for the provided symbol");
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const updateChart = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const { labels, prices } = await fetchStockData(symbol);
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateChart(symbol); // Default chart on page load
  }, [symbol]);

  return (
    <div className="container mx-auto text-center py-4">
      <h1 className="text-2xl font-bold mb-4">Shares</h1>
      <div className="flex justify-center items-center mb-4 space-x-2">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
          className="border p-2 rounded-md"
        />
        <button
          onClick={() => updateChart(symbol)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Fetch Chart
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartData ? (
        <div>
          <Line data={chartData} />
        </div>
      ) : null}
    </div>
  );
};

export default Shares;
