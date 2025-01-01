import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Store, FileText, Book, Headphones, BookOpen, Image } from "lucide-react";

const sidebarItems = [
  { icon: <Video className="w-4 h-4" />, label: "Videos" },
  { icon: <Store className="w-4 h-4" />, label: "Clothing" },
  { icon: <FileText className="w-4 h-4" />, label: "PDFs" },
  { icon: <Book className="w-4 h-4" />, label: "Books" },
  { icon: <Headphones className="w-4 h-4" />, label: "Podcasts" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Ebooks" },
  { icon: <Video className="w-4 h-4" />, label: "Lives" },
  { icon: <Image className="w-4 h-4" />, label: "Photos" },
];

const VendorSidebar = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default VendorSidebar;