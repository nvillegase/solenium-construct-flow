
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useWorkQuantityMaterials = () => {
  const { toast } = useToast();

  const createWorkQuantityMaterialRelations = async (
    workQuantityId: string,
    materialIds: string[]
  ) => {
    try {
      // Create the relations in the work_quantity_materials table
      const { error } = await supabase
        .from('work_quantity_materials')
        .insert(
          materialIds.map(materialId => ({
            project_work_quantity_id: workQuantityId,
            project_material_id: materialId
          }))
        );

      if (error) throw error;

      toast({
        title: "Materiales asociados",
        description: "Los materiales han sido asociados exitosamente a la cantidad de obra"
      });

      return true;
    } catch (error) {
      console.error("Error creating work quantity material relations:", error);
      toast({
        title: "Error",
        description: "No se pudieron asociar los materiales",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createWorkQuantityMaterialRelations
  };
};
