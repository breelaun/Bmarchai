
import React from 'react';
import { Card } from "@/components/ui/card";
import Requests from '@/components/chat/sections/Requests';

const RequestsPage = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Card className="p-4">
        <Requests />
      </Card>
    </div>
  );
};

export default RequestsPage;
