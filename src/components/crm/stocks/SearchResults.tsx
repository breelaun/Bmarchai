import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SearchResultsProps {
  query: string;
  onAddToFavorites: (symbol: string, companyName: string) => void;
  favorites: Array<{ symbol: string }>;
}

export const SearchResults = ({ query, onAddToFavorites, favorites }: SearchResultsProps) => {
  if (!query) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Search results will be displayed here */}
          {/* This is a placeholder for demonstration */}
          <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
            <div>
              <p className="font-medium">AAPL</p>
              <p className="text-sm text-muted-foreground">Apple Inc.</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddToFavorites("AAPL", "Apple Inc.")}
              disabled={favorites.some(f => f.symbol === "AAPL")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};