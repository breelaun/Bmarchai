import { Card, CardContent } from "@/components/ui/card";
import { Grid, LayoutGrid, List } from "lucide-react";

interface TemplatePreviewPaneProps {
  templateStyle: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
    font: string;
  };
  displayStyle: string;
  bentoStyle: string;
}

const TemplatePreviewPane = ({
  templateStyle,
  displayStyle,
  bentoStyle,
}: TemplatePreviewPaneProps) => {
  const getLayoutIcon = () => {
    switch (bentoStyle) {
      case "grid":
        return <Grid className="h-5 w-5" />;
      case "masonry":
        return <LayoutGrid className="h-5 w-5" />;
      case "list":
        return <List className="h-5 w-5" />;
      default:
        return <Grid className="h-5 w-5" />;
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div
            className="h-12 flex items-center justify-between px-4 rounded-lg"
            style={{
              backgroundColor: templateStyle.colors.primary,
              color: "#fff",
              fontFamily: templateStyle.font,
            }}
          >
            <span className="font-semibold">Store Preview</span>
            {getLayoutIcon()}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`aspect-square rounded-lg ${
                  bentoStyle === "list" ? "col-span-2 md:col-span-3 h-24 aspect-auto" : ""
                }`}
                style={{
                  backgroundColor: templateStyle.colors.secondary,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Display Style: {displayStyle}</p>
            <p>Layout: {bentoStyle}</p>
            <p>Font: {templateStyle.font}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreviewPane;