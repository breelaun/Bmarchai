import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Trash2, Globe, Building2, FileText } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const getContactTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'client':
        return 'default';
      case 'contact':
        return 'secondary';
      case 'lead':
        return 'outline';
      default:
        return 'outline';
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

      <div className="flex items-center px-2">
        <Input
          placeholder="Search contacts..."
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Social</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    {client.company && (
                      <span className="text-sm text-muted-foreground">
                        {client.company}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getContactTypeBadgeVariant(client.contact_type)}>
                    {client.contact_type || 'lead'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.emails && client.emails.length > 0 && (
                    <a 
                      href={`mailto:${client.emails[0]}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      {client.emails[0]}
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {client.phone && (
                    <a 
                      href={`tel:${client.phone}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {client.status || 'New'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.website && (
                    <a 
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {client.social_links && Object.entries(client.social_links).some(([_, value]) => value) && (
                    <div className="flex gap-2">
                      {Object.entries(client.social_links).map(([platform, url]) => 
                        url && (
                          <a 
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline capitalize"
                          >
                            {platform}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Tasks
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;