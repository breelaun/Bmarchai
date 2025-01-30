import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Advertisement } from "../types";

interface AdListProps {
  filter?: string;
  onCreateClick?: () => void;
  onEditClick?: (ad: Advertisement) => void;
}

export const AdList = ({ filter, onCreateClick, onEditClick }: AdListProps) => {
  const { data: ads, isLoading } = useQuery({
    queryKey: ["advertisements", filter],
    queryFn: async () => {
      let query = supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "active") {
        query = query.eq("status", "active");
      } else if (filter === "scheduled") {
        query = query.eq("status", "scheduled");
      } else if (filter === "completed") {
        query = query.eq("status", "completed");
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Convert date strings to Date objects
      return data.map(ad => ({
        ...ad,
        start_date: new Date(ad.start_date),
        end_date: new Date(ad.end_date)
      })) as Advertisement[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "secondary";
      case "draft":
        return "outline";
      case "expired":
      case "inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisements</h2>
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Ad
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads?.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell>{ad.name}</TableCell>
              <TableCell className="capitalize">{ad.ad_type}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(ad.status)}>
                  {ad.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(ad.start_date, "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(ad.end_date, "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => onEditClick?.(ad)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};