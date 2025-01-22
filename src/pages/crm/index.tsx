import { StockMarket } from "@/components/crm/StockMarket";

const CRMPage = () => {
  return (
    <div className="container mx-auto p-4">
      <StockMarket defaultSymbol="AAPL" />
    </div>
  );
};

export default CRMPage;