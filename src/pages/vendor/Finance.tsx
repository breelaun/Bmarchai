import { VendorPayouts } from "@/components/payment/VendorPayouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VendorFinance = () => {
  const { data: stats } = useQuery({
    queryKey: ['vendor-finance-stats'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('payment_transactions')
        .select('amount, commission_amount, vendor_payout_amount, status')
        .eq('status', 'completed');

      if (error) throw error;

      return transactions.reduce((acc, curr) => ({
        totalSales: acc.totalSales + Number(curr.amount),
        totalCommission: acc.totalCommission + Number(curr.commission_amount),
        totalPayout: acc.totalPayout + Number(curr.vendor_payout_amount),
      }), {
        totalSales: 0,
        totalCommission: 0,
        totalPayout: 0,
      });
    },
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats ? formatAmount(stats.totalSales) : '$0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats ? formatAmount(stats.totalCommission) : '$0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats ? formatAmount(stats.totalPayout) : '$0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      <VendorPayouts />
    </div>
  );
};

export default VendorFinance;