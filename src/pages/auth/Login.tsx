import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToolTracking } from "@/hooks/use-tool-tracking";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackToolUsage } = useToolTracking();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        trackToolUsage({
          tool: "auth",
          action: "login_success",
          metadata: {
            provider: session.user?.app_metadata?.provider || "email",
          },
        });
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, trackToolUsage]);

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
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Already have an account? Sign in",
              },
              forgotten_password: {
                link_text: 'Forgot your password?',
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email',
                button_label: 'Send reset password instructions',
                loading_button_label: 'Sending reset instructions ...',
                confirmation_text: 'Check your email for the password reset link',
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;