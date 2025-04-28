import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkQuantity } from "@/lib/types";

export const useWorkQuantitiesDB = () => {
  const { toast } = useToast();

  const fetchWorkQuantities = async (projectId: string) => {
    if (!projectId) return [];
    
    try {
      // First fetch work quantities with their catalog info
      const { data: workQuantitiesData, error: workQuantitiesError } = await supabase
        .from('project_work_quantities')
        .select(`
          id,
          quantity,
          expected_execution_date,
          work_quantity_id,
          work_quantity_catalog (
            description,
            unit
          )
        `)
        .eq('project_id', projectId);

      if (workQuantitiesError) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las cantidades de obra",
          variant: "destructive",
        });
        throw workQuantitiesError;
      }

      // Then fetch all material relations for these work quantities
      const workQuantityIds = workQuantitiesData.map(wq => wq.id);
      const { data: materialRelations, error: materialRelationsError } = await supabase
        .from('work_quantity_materials')
        .select('project_work_quantity_id, project_material_id')
        .in('project_work_quantity_id', workQuantityIds);

      if (materialRelationsError) {
        console.error("Error fetching material relations:", materialRelationsError);
        // Don't throw here, we'll return work quantities without material relations
      }

      // Map the relations to each work quantity
      const workQuantities = workQuantitiesData.map(item => {
        const relatedMaterialIds = materialRelations
          ?.filter(rel => rel.project_work_quantity_id === item.id)
          .map(rel => rel.project_material_id) || [];

        return {
          id: item.id,
          projectId,
          description: item.work_quantity_catalog.description,
          unit: item.work_quantity_catalog.unit,
          quantity: item.quantity,
          expectedExecutionDate: item.expected_execution_date,
          catalogId: item.work_quantity_id,
          materialIds: relatedMaterialIds
        };
      });

      return workQuantities;
    } catch (error) {
      console.error("Error in fetchWorkQuantities:", error);
      throw error;
    }
  };

  const createWorkQuantity = async (workQuantity: Omit<WorkQuantity, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('project_work_quantities')
        .insert({
          project_id: workQuantity.projectId,
          work_quantity_id: workQuantity.catalogId,
          quantity: workQuantity.quantity,
          expected_execution_date: workQuantity.expectedExecutionDate || null,
        })
        .select('*')
        .single();

      if (error) throw error;

      toast({
        title: "Cantidad de obra creada",
        description: "La cantidad de obra ha sido guardada exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error creating work quantity:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la cantidad de obra",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createWorkQuantity,
    fetchWorkQuantities,
  };
};
