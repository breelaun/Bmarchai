import { useEffect } from "react";
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

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (session) {
      console.log("Session detected, redirecting to home");
      navigate("/");
    }
  }, [session, navigate]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
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
          redirectTo={window.location.origin}
          onError={(error) => {
            console.error("Auth error:", error);
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Login;