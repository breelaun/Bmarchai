import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          handleSuccessfulLogin(session);
          break;
        case 'SIGN_IN_ERROR':
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

  const handleSuccessfulLogin = async (session) => {
    setIsLoading(true);
    try {
      // Optional: Fetch additional user profile data
      const { data: { user } } = await supabase.auth.getUser();
      
      toast({
        title: "Welcome Back",
        description: `Logged in as ${user?.email}`,
        variant: "success"
      });
      
      navigateToProfile();
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error = null) => {
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
          redirectTo={window.location.origin + "/profile"}
          onSuccess={handleSuccessfulLogin}
          onError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default Login;
