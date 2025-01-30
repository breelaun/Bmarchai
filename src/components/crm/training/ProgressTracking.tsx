import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Weight, Ruler, Calendar, ClipboardList, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type ProgressRecord = {
  id: string;
  member: {
    id: string;
    user: {
      full_name: string;
    };
  } | null;
  measurement_date: string;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  notes?: string;
  measurements?: Record<string, number>;
};

type ProgressFormData = {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
};

export const ProgressTracking = () => {
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const { toast } = useToast();
  const form = useForm<ProgressFormData>();

  const { data: progressRecords, isLoading } = useQuery({
    queryKey: ["member-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_progress")
        .select(`
          *,
          member:member_id (
            id,
            user:user_id (
              full_name
            )
          )
        `)
        .order("measurement_date", { ascending: false });

      if (error) throw error;
      return data as ProgressRecord[];
    },
  });

  const onSubmit = async (data: ProgressFormData) => {
    try {
      const { error } = await supabase.from("member_progress").insert([
        {
          member_id: "MEMBER_ID", // You'll need to pass the actual member ID
          weight: data.weight,
          body_fat_percentage: data.bodyFat,
          muscle_mass: data.muscleMass,
          notes: data.notes,
          measurement_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress record has been added",
      });
      
      setIsAddingProgress(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add progress record",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Progress Tracking</h2>
        <Dialog open={isAddingProgress} onOpenChange={setIsAddingProgress}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Progress Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress Record</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bodyFat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Fat %</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="muscleMass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muscle Mass (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingProgress(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Record</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {progressRecords?.map((record) => (
          <Card 
            key={record.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {record.member?.user?.full_name || "Unknown Member"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>{" "}
                {new Date(record.measurement_date).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Weight:</span>{" "}
                {record.weight} kg
              </div>

              {record.body_fat_percentage && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Body Fat:</span>{" "}
                  {record.body_fat_percentage}%
                </div>
              )}

              {record.muscle_mass && (
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Muscle Mass:</span>{" "}
                  {record.muscle_mass} kg
                </div>
              )}

              {record.notes && (
                <div className="flex items-center gap-2 text-sm">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Notes:</span> {record.notes}
                </div>
              )}

              {record.measurements && Object.keys(record.measurements).length > 0 && (
                <div className="mt-2 text-sm">
                  <h4 className="font-medium mb-1">Additional Measurements:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(record.measurements).map(([key, value]) => (
                      <div key={key}>
                        <span className="capitalize">{key}:</span>{" "}
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};