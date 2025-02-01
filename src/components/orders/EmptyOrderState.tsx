import { Package, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyOrderStateProps {
  type: "made" | "received";
}

export const EmptyOrderState = ({ type }: EmptyOrderStateProps) => {
  const Icon = type === "made" ? ShoppingBag : Package;
  const title = type === "made" ? "No Orders Made" : "No Orders Received";
  const description = type === "made" 
    ? "You haven't made any orders yet."
    : "You haven't received any orders yet.";

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};