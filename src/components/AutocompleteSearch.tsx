import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface AutocompleteSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  embeds: Array<{
    arts_categories?: {
      name: string;
    } | null;
  }>;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  embeds
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  // Extract unique categories from embeds
  const uniqueCategories = [...new Set(
    embeds
      .map(embed => embed.arts_categories?.name)
      .filter((name): name is string => name !== null && name !== undefined)
  )];

  // Filter categories based on search input
  useEffect(() => {
    if (searchQuery) {
      const filtered = uniqueCategories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, uniqueCategories]);

  return (
    <div className="mx-auto py-4 px-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            onFocus={() => setShowSuggestions(true)}
          />
          
          {showSuggestions && filteredCategories.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCategories.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedCategory && (
          <Badge 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {selectedCategory}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => setSelectedCategory(null)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AutocompleteSearch;