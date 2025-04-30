
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useActivities = (projectId?: string, date?: string) => {
  const { toast } = useToast();

  const { 
    data: activities, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["activities", projectId, date],
    queryFn: async () => {
      if (!projectId) return [];
      
      try {
        let query = supabase
          .from("activities")
          .select(`
            *,
            contractors:contractor_id(id, name)
          `)
          .eq("project_id", projectId);
        
        if (date) {
          query = query.eq("date", date);
        }
        
        const { data, error } = await query.order("name");
        
        if (error) {
          console.error("Error fetching activities:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las actividades. Verifique sus permisos.",
            variant: "destructive"
          });
          throw error;
        }
        
        // Transform data to match our Activity type
        return data.map(item => ({
          id: item.id,
          projectId: item.project_id,
          workQuantityId: item.project_work_quantity_id,
          name: item.name,
          contractorId: item.contractor_id,
          contractorName: item.contractors?.name || "Sin contratista",
          estimatedQuantity: item.estimated_quantity,
          executedQuantity: item.executed_quantity,
          unit: item.unit,
          date: item.date,
          notes: item.notes || undefined,
          progress: item.progress,
        })) as Activity[];
      } catch (err) {
        console.error("Activities fetch error:", err);
        return [];
      }
    },
    enabled: !!projectId,
  });

  return { activities: activities || [], isLoading, error, refetch };
};
