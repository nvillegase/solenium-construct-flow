
import { useQuery } from "@tanstack/react-query";
import { mockActivityMaterials } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export interface ActivityMaterial {
  activityId: string;
  projectMaterialId: string;
  materialName?: string;
  quantity?: number;
  unit?: string;
}

export const useActivityMaterials = (activityId?: string) => {
  const { toast } = useToast();

  const {
    data: activityMaterials,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["activity-materials", activityId],
    queryFn: async () => {
      if (!activityId) return [];
      
      try {
        // Simulate async loading
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const materials = mockActivityMaterials
          .filter(item => item.activityId === activityId)
          .map(item => ({
            activityId: item.activityId,
            projectMaterialId: item.projectMaterialId,
            materialName: item.materialName,
            quantity: item.quantity,
            unit: item.unit
          }));
        
        return materials;
      } catch (err) {
        console.error("Activity materials fetch error:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar los materiales de la actividad.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!activityId,
  });

  return { activityMaterials: activityMaterials || [], isLoading, error, refetch };
};
