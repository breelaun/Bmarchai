import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // You could implement additional success handling here
  }, []);

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;