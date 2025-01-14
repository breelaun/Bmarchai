import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const VendorProfileSetup = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/vendor/profile");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Profile Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Your vendor profile has been created. Click below to start customizing your profile.
            </p>
            <Button onClick={handleComplete}>
              Continue to Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfileSetup;