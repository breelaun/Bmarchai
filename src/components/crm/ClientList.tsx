import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody } from "@/components/ui/table";
import { ClientSearchBar } from "./components/ClientSearchBar";
import { ClientTableHeader } from "./components/ClientTableHeader";
import { ClientTableRow } from "./components/ClientTableRow";
import { ScrollArea } from "@/components/ui/scroll-area";

const ClientList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client has been deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Contacts</h2>
        <ClientForm />
      </div>

      <ClientSearchBar />

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-20rem)]" type="always">
          <div className="min-w-[1000px]">
            <Table>
              <ClientTableHeader />
              <TableBody>
                {clients?.map((client) => (
                  <ClientTableRow
                    key={client.id}
                    client={client}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ClientList;