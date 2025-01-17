import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteStock {
  id: string;
  symbol: string;
  company_name: string;
}

const FavoriteStocks = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorite-stocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorite_stocks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FavoriteStock[];
    },
    enabled: !!session?.user?.id,
  });

  const removeFavorite = useMutation({
    mutationFn: async (stockId: string) => {
      const { error } = await supabase
        .from("favorite_stocks")
        .delete()
        .eq("id", stockId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-stocks"] });
      toast({
        title: "Stock removed from favorites",
        description: "Your favorites list has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove stock from favorites.",
        variant: "destructive",
      });
      console.error("Error removing favorite:", error);
    },
  });

  useEffect(() => {
    if (!session?.user?.id || isSubscribed) return;

    const channel = supabase
      .channel("favorite-stocks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorite_stocks",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          queryClient.invalidateQueries({ queryKey: ["favorite-stocks"] });
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [session?.user?.id, queryClient, isSubscribed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Favorite Stocks
          <span className="text-sm text-muted-foreground ml-2">
            ({favorites.length}/10)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No favorite stocks yet. Add some from the search results!
          </p>
        ) : (
          <div className="space-y-2">
            {favorites.map((stock) => (
              <div
                key={stock.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {stock.company_name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFavorite.mutate(stock.id)}
                  disabled={removeFavorite.isPending}
                >
                  {removeFavorite.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteStocks;