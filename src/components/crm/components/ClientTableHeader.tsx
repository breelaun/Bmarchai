import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ClientTableHeader = () => {
  return (
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
  );
};