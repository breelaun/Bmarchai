import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VendorStoreProps {
  vendorId?: string;
}

const VendorStore = ({ vendorId }: VendorStoreProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Store Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the vendor's store view (ID: {vendorId}).
            The actual store layout will be determined by the selected template and customization options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStore;