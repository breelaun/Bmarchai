import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

interface VendorStoreProps {
  vendorId?: string;
}

const VendorStore = ({ vendorId }: VendorStoreProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            Store Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a preview of the vendor's store (ID: {vendorId}).
            Products and inventory will be displayed here based on the selected template and display options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStore;