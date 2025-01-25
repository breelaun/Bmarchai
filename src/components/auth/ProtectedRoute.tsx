import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [session, navigate, toast]);

  return session ? <>{children}</> : null;
}