import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LEAD_STAGES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed_won", label: "Closed Won" },
  { id: "closed_lost", label: "Closed Lost" },
];

export const LeadPipeline = () => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_clients")
        .select("*")
        .eq("contact_type", "lead")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Lead Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = leads?.filter((lead) => lead.lead_stage === stage.id) || [];
          
          return (
            <Card key={stage.id} className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {stage.label}
                  <span className="ml-2 text-muted-foreground">
                    ({stageLeads.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stageLeads.map((lead) => (
                  <Card key={lead.id} className="p-3">
                    <h3 className="font-medium">{lead.name}</h3>
                    {lead.company && (
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    )}
                    {lead.expected_value && (
                      <p className="text-sm font-medium text-green-600">
                        ${lead.expected_value.toLocaleString()}
                      </p>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};