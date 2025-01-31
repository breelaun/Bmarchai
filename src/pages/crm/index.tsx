import React from 'react';
import StockMarket from '@/components/crm/StockMarket';

const CRMPage = () => {
  return (
    <div className="container mx-auto p-4">
      <StockMarket symbol="AAPL" timeRange="1D" />
    </div>
  );
};

export default CRMPage;