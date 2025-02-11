
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
      formProps={{
        handleSubmit: (e) => {
          // Access the form data before submission
          const formData = new FormData(e.target as HTMLFormElement);
          const email = formData.get('email') as string;
          // Extract username from email for the full_name field
          const username = email.split('@')[0];
          // Set metadata with full_name
          const metadata = {
            full_name: username
          };
          // Update the hidden metadata field
          const metadataInput = document.createElement('input');
          metadataInput.type = 'hidden';
          metadataInput.name = 'options';
          metadataInput.value = JSON.stringify({ data: metadata });
          (e.target as HTMLFormElement).appendChild(metadataInput);
        }
      }}
    />
  );
};

export default AuthForm;
