import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  return (
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
      redirectTo="https://6f714e32-18dd-46c3-aa52-8aaead7bb41d.lovableproject.com"
    />
  );
};

export default AuthForm;