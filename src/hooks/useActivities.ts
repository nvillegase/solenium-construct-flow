
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { mockActivities, mockContractors } from "@/lib/mock-data";
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
        // Simulate async loading
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let filteredActivities = mockActivities.filter(activity => 
          activity.projectId === projectId
        );
        
        if (date) {
          filteredActivities = filteredActivities.filter(activity => 
            activity.date === date
          );
        }
        
        // Enrich with contractor names
        const enrichedActivities = filteredActivities.map(activity => {
          const contractor = mockContractors.find(c => c.id === activity.contractorId);
          return {
            ...activity,
            contractorName: contractor?.name || activity.contractorId
          };
        });
        
        return enrichedActivities;
      } catch (err) {
        console.error("Activities fetch error:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar las actividades.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!projectId,
  });

  return { activities: activities || [], isLoading, error, refetch };
};
