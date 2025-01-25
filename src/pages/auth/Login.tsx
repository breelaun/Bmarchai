import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug log for session state
  useEffect(() => {
    console.log("Current session:", session);
  }, [session]);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      console.log("Session detected, redirecting to profile");
      navigate("/profile");
    }
  }, [session, navigate]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (event === 'SIGNED_IN' && currentSession) {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${currentSession.user.email}`,
        });
        navigate("/profile");
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
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;