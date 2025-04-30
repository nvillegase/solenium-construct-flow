
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
        const { data, error } = await supabase
          .from("activity_materials")
          .select(`
            activity_id,
            project_material_id,
            project_materials:project_material_id (
              material_catalog:material_id (
                name,
                unit
              )
            )
          `)
          .eq("activity_id", activityId);
        
        if (error) {
          console.error("Error fetching activity materials:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los materiales de la actividad. Verifique sus permisos.",
            variant: "destructive"
          });
          throw error;
        }
        
        return data.map(item => ({
          activityId: item.activity_id,
          projectMaterialId: item.project_material_id,
          materialName: item.project_materials?.material_catalog?.name,
          unit: item.project_materials?.material_catalog?.unit
        })) as ActivityMaterial[];
      } catch (err) {
        console.error("Activity materials fetch error:", err);
        return [];
      }
    },
    enabled: !!activityId,
  });

  return { activityMaterials: activityMaterials || [], isLoading, error, refetch };
};
