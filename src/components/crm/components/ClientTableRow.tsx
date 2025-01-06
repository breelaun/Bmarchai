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
      case "client":
        return "default";
      case "contact":
        return "secondary";
      case "lead":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <TableRow>
      {/* Client Name and Company */}
      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex flex-col">
          <span>{client.name}</span>
          {client.company && (
            <span className="text-sm text-muted-foreground truncate">
              {client.company}
            </span>
          )}
        </div>
      </TableCell>

      {/* Contact Type */}
      <TableCell>
        <Badge
          variant={getContactTypeBadgeVariant(client.contact_type)}
          className="truncate"
        >
          {client.contact_type || "lead"}
        </Badge>
      </TableCell>

      {/* Email */}
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
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

      {/* Phone */}
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
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

      {/* Status */}
      <TableCell>
        <Badge variant="outline" className="truncate">
          {client.status || "New"}
        </Badge>
      </TableCell>

      {/* Website */}
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
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

      {/* Social Links */}
      <TableCell>
        {client.social_links &&
          Object.entries(client.social_links).some(([_, value]) => value) && (
            <div className="flex gap-2">
              {Object.entries(client.social_links).map(
                ([platform, url]) =>
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

      {/* Actions */}
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
          onClick={() => onDelete(client.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
