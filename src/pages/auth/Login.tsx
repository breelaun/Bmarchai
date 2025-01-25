import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      debug: true
    }
  }
);

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authState, setAuthState] = useState({
    session: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    // Retrieve initial session
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      console.group('🔐 Auth Diagnostics');
      console.log('Initial Session:', session);
      console.log('Environment URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Client Initialized:', !!supabaseClient);
      console.groupEnd();

      if (session) {
        navigate("/profile");
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('🚨 Auth State Change:', event, session);

      switch (event) {
        case 'SIGNED_IN':
          toast({
            title: "Login Successful",
            description: `Authenticated as: ${session?.user?.email}`,
            variant: "success"
          });
          navigate("/profile");
          break;
        
        case 'SIGN_OUT':
          toast({
            title: "Logged Out",
            description: "You have been signed out",
            variant: "default"
          });
          break;
        
        case 'AUTHENTICATION_ERROR':
          toast({
            title: "Authentication Error",
            description: "Unable to authenticate. Please try again.",
            variant: "destructive"
          });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLoginError = (error) => {
    console.error('🚨 Login Error:', error);
    toast({
      title: "Login Failed",
      description: error?.message || "Authentication unsuccessful",
      variant: "destructive"
    });
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Auth
          supabaseClient={supabaseClient}
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
          onError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default Login;
