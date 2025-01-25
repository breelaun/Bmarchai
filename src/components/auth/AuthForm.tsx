import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting login process for:", email);
      
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      if (session) {
        console.log("Session created successfully:", session);
        
        // Verify the session was stored
        const currentSession = await supabase.auth.getSession();
        console.log("Current session after login:", currentSession);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log("Auth state changed:", event, currentSession);
          if (event === 'SIGNED_IN' && currentSession) {
            toast({
              title: "Success",
              description: "Successfully logged in!",
            });
            navigate("/profile");
          }
        });

        // Clean up subscription
        return () => {
          subscription.unsubscribe();
        };
      } else {
        throw new Error("No session created");
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;