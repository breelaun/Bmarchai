import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface VendorPayout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'stripe' | 'paypal' | 'google_pay';
  created_at: string;
  updated_at: string;
}

const VendorPayouts = () => {
  const { data: payouts, isLoading } = useQuery({
    queryKey: ['vendor-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payouts:', error);
        throw error;
      }

      return data as VendorPayout[];
    },
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: VendorPayout['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payouts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payouts?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payouts found
            </p>
          ) : (
            payouts?.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{formatAmount(payout.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payout.created_at), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(payout.status)} text-white`}
                  >
                    {payout.status}
                  </Badge>
                  <Badge variant="outline">{payout.provider}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorPayouts;