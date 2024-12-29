import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Vendors = () => {
  const mockVendors = [
    {
      id: 1,
      name: "Elite Fitness Pro",
      description: "Professional fitness equipment and personalized training programs",
      rating: 4.8,
      productsCount: 45,
      templateStyle: "Modern Dark",
    },
    {
      id: 2,
      name: "Sports Nutrition Plus",
      description: "Premium supplements and nutrition consultation",
      rating: 4.6,
      productsCount: 78,
      templateStyle: "Classic Elegance",
    },
    {
      id: 3,
      name: "Power Training Hub",
      description: "Specialized strength training and coaching services",
      rating: 4.9,
      productsCount: 32,
      templateStyle: "Bold & Modern",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-heading font-bold text-gradient">Featured Vendors</h1>
          <p className="text-muted-foreground">
            Discover top-rated vendors offering premium fitness products and services
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search vendors..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline">
            Become a Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVendors.map((vendor) => (
            <Card key={vendor.id} className="bg-card hover:bg-card/80 transition-colors">
              <CardHeader>
                <CardTitle>{vendor.name}</CardTitle>
                <CardDescription>Template: {vendor.templateStyle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{vendor.description}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <span>⭐ {vendor.rating}</span>
                  <span>{vendor.productsCount} Products</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Profile</Button>
                <Button variant="default" size="sm">Visit Store</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vendors;