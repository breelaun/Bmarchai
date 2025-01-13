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

  // Helper function to render display style preview
  const renderDisplayStylePreview = () => {
    switch (displayStyle) {
      case "minimal":
        return (
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
            <div className="h-4 w-1/2 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
          </div>
        );
      case "detailed":
        return (
          <div className="space-y-2">
            <div className="h-4 w-full rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
            <div className="h-4 w-1/2 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
          </div>
        );
      case "compact":
        return (
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
            <div className="h-8 w-24 rounded" style={{ backgroundColor: templateStyle.colors.secondary, opacity: 0.5 }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Display Style Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Display Style</h3>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: templateStyle.colors.background,
              }}
            >
              {renderDisplayStylePreview()}
            </div>
          </div>

          {/* Layout Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Layout Style</h3>
            <div
              className="p-4 rounded-lg flex items-center justify-between"
              style={{
                backgroundColor: templateStyle.colors.background,
              }}
            >
              <div className="flex gap-2">
                {getLayoutIcon()}
                <span>{bentoStyle.charAt(0).toUpperCase() + bentoStyle.slice(1)} Layout</span>
              </div>
            </div>
          </div>

          {/* Font Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Font Style</h3>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: templateStyle.colors.background,
                fontFamily: templateStyle.font,
              }}
            >
              <span className="text-lg">Profile Setup</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreviewPane;