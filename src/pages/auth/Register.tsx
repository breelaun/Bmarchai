import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import VendorModeToggle from "@/components/auth/VendorModeToggle";
import AuthForm from "@/components/auth/AuthForm";

const Register = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (session) {
      console.log("Session detected, redirecting...");
      toast.success("Registration successful!");
      if (isVendor) {
        navigate("/vendors/new");
      } else {
        navigate("/");
      }
    }
  }, [session, navigate, isVendor]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      console.log('Auth state changed:', event); // Debug log
      if (event === 'SIGNED_IN') {
        toast.success("Account created successfully!");
        if (isVendor) {
          navigate("/vendors/new");
        } else {
          navigate("/");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isVendor]);

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VendorModeToggle isVendor={isVendor} onToggle={setIsVendor} />
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;