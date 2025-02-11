
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  const handleSignUp = async ({ email, password }: { email: string, password: string }) => {
    const username = email.split('@')[0];
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username
        }
      }
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
    }
    return { data, error };
  };

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
      authSchema={handleSignUp}
    />
  );
};

export default AuthForm;
