import { format } from "date-fns";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image_url: string | null;
  };
}

interface OrderCardProps {
  order: {
    id: string;
    created_at: string;
    order_status: string;
    total_amount: number;
    vendor_notes?: string;
    order_items: OrderItem[];
    vendor?: {
      id: string;
      business_name: string;
      contact_email: string;
    };
    vendor_user?: {
      id: string;
      full_name: string;
      username: string;
    };
    user?: {
      id: string;
      full_name: string;
      username: string;
    };
  };
  type: "made" | "received";
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "confirmed":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

export const OrderCard = ({ order, type }: OrderCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.created_at), "PPP")}
          </p>
        </div>
        <Badge className={getStatusBadgeColor(order.order_status)}>
          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "made" ? (
            <div>
              <p className="text-sm">
                <span className="font-medium">Vendor ID:</span> {order.vendor?.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Vendor Name:</span>{" "}
                {order.vendor?.business_name || "Unknown Vendor"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Vendor Contact:</span>{" "}
                {order.vendor?.contact_email}
              </p>
              {order.vendor_user && (
                <p className="text-sm">
                  <span className="font-medium">Vendor Profile:</span>{" "}
                  {order.vendor_user.full_name || order.vendor_user.username}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm">
                <span className="font-medium">Customer ID:</span> {order.user?.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Customer Name:</span>{" "}
                {order.user?.full_name || order.user?.username || "Unknown Customer"}
              </p>
            </div>
          )}
          <div className="space-y-2">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.product?.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price_at_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-right font-medium">Total: ${order.total_amount}</p>
          {order.vendor_notes && type === "made" && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Vendor Notes:</p>
              <p className="text-sm text-muted-foreground">{order.vendor_notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};