import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Trash2, Globe } from "lucide-react";
import { Client } from "../types";

interface ClientTableRowProps {
  client: Client;
  onDelete: (id: string) => void;
}

export const ClientTableRow = ({ client, onDelete }: ClientTableRowProps) => {
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

  return (
    <TableRow>
      <TableCell className="font-medium min-w-[150px]">
        <div className="flex flex-col">
          <span className="truncate">{client.name}</span>
          {client.company && (
            <span className="text-sm text-muted-foreground truncate">
              {client.company}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Badge variant={getContactTypeBadgeVariant(client.contact_type)}>
          {client.contact_type || 'lead'}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[200px]">
        {client.emails && client.emails.length > 0 && (
          <a 
            href={`mailto:${client.emails[0]}`}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{client.emails[0]}</span>
          </a>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {client.phone && (
          <a 
            href={`tel:${client.phone}`}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{client.phone}</span>
          </a>
        )}
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Badge variant="outline">
          {client.status || 'New'}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[120px]">
        {client.website && (
          <a 
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Website</span>
          </a>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {client.social_links && Object.entries(client.social_links).some(([_, value]) => value) && (
          <div className="flex gap-2 overflow-x-auto">
            {Object.entries(client.social_links).map(([platform, url]) => 
              url && (
                <a 
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline capitalize whitespace-nowrap"
                >
                  {platform}
                </a>
              )
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Button variant="ghost" size="sm" className="whitespace-nowrap">
          View Tasks
        </Button>
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90"
          onClick={() => onDelete(client.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};