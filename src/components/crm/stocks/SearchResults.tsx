import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SearchResultsProps {
  results: any[];
  onAddToFavorites: (symbol: string, companyName: string) => void;
  favorites: Array<{ symbol: string }>;
}

export const SearchResults = ({ results, onAddToFavorites, favorites }: SearchResultsProps) => {
  if (!results.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Results</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {results.map((result) => (
            <div 
              key={result["1. symbol"]} 
              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">{result["1. symbol"]}</p>
                <p className="text-sm text-muted-foreground">{result["2. name"]}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddToFavorites(result["1. symbol"], result["2. name"])}
                disabled={favorites.some(f => f.symbol === result["1. symbol"])}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};