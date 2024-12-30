import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Register = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (session) {
      // If user is registered as a vendor, redirect them to vendor setup
      if (isVendor) {
        navigate("/vendors/new");
      } else {
        navigate("/");
      }
    }
  }, [session, navigate, isVendor]);

  const handleSignUp = {
    data: {
      is_vendor: isVendor,
    },
  };

  // Add custom email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="vendor-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Register as a Vendor
            </Label>
            <Switch
              id="vendor-mode"
              checked={isVendor}
              onCheckedChange={setIsVendor}
            />
          </div>
          
          {isVendor && (
            <div className="text-sm text-muted-foreground">
              You will be redirected to set up your vendor profile after registration.
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--color-primary))',
                    brandAccent: 'rgb(var(--color-primary))',
                  }
                }
              }
            }}
            theme="light"
            providers={[]}
            view="sign_up"
            showLinks={true}
            redirectTo={window.location.origin}
            additionalData={handleSignUp.data}
            onSuccess={() => {
              toast.success("Registration successful!");
            }}
            onError={(error) => {
              toast.error(error.message || "Registration failed");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;