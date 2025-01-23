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

  // Enhanced debugging useEffect
  useEffect(() => {
    console.log('Debug - Session Object:', session);
    console.log('Debug - Session Details:', {
      exists: !!session,
      user: session?.user,
      accessToken: !!session?.access_token
    });

    if (session) {
      try {
        trackToolUsage({
          tool: "auth",
          action: "login_success",
          metadata: {
            provider: session.user?.app_metadata?.provider || "email",
          },
        });
        navigate("/"); // Redirect to home
      } catch (error) {
        console.error('Navigation Error:', error);
      }
    }
  }, [session, navigate, trackToolUsage]);

  return (
    // ... existing return code
  );
};

export default Login;
