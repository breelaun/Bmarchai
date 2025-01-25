import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigateToProfile();
    }
  }, [session]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      switch (event) {
        case 'SIGNED_IN':
          handleSuccessfulLogin(session);
          break;
        case 'SIGNED_OUT':
          handleLoginError();
          break;
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Password Recovery",
            description: "Check your email to reset your password.",
            variant: "default"
          });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSuccessfulLogin = async (session: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      toast({
        title: "Welcome Back",
        description: `Logged in as ${user?.email}`,
        variant: "default"
      });
      
      navigateToProfile();
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: any = null) => {
    toast({
      title: "Login Error",
      description: error?.message || "Unable to log in. Please try again.",
      variant: "destructive"
    });
    setIsLoading(false);
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLoading ? "Logging In..." : "Welcome Back"}
        </h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;