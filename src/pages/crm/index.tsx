import React from 'react';
import { StockChart } from '@/components/crm/StockMarket';

const CRMPage = () => {
  return (
    <div>
      <StockChart symbol="AAPL" />
    </div>
  );
};

export default CRMPage;