import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToolTracking } from "@/hooks/use-tool-tracking";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { trackToolUsage } = useToolTracking();

  useEffect(() => {
    if (session) {
      trackToolUsage({
        tool: "auth",
        action: "login_success",
        metadata: {
          provider: session.user?.app_metadata?.provider || "email",
        },
      });
      navigate("/");
    }
  }, [session, navigate, trackToolUsage]);

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
          view="sign_in"
          showLinks={true}
          magicLink={true}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Login;