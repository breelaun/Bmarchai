import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArtsSection from "@/components/admin/ArtsSection";
import YouTubeEmbedsManager from "@/components/admin/YouTubeEmbedsManager";

const AdminPage = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
    } else if (profile && !profile.admin) {
      navigate("/");
    }
  }, [session, profile, navigate]);

  if (!profile?.admin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <ArtsSection />
      <div className="mt-8">
        <YouTubeEmbedsManager />
      </div>
    </div>
  );
};

export default AdminPage;
