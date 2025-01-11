import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-6 h-6 text-destructive" />
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;