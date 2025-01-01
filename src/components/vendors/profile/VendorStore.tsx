import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const VendorStore = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Store</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50">
            <CardContent className="p-4 text-center">
              <Button variant="ghost" className="w-full h-32 border-2 border-dashed">
                <Plus className="w-6 h-6" />
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">Add your first product</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorStore;