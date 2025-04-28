
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkQuantity } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useWorkQuantitiesDB = () => {
  const { toast } = useToast();

  const fetchWorkQuantities = async (projectId: string) => {
    if (!projectId) return [];
    
    // Fetch work quantities with their catalog info
    const { data: workQuantitiesData, error } = await supabase
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

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las cantidades de obra",
        variant: "destructive",
      });
      throw error;
    }

    // Now fetch the related materials for each work quantity
    const workQuantities = await Promise.all(workQuantitiesData.map(async (item) => {
      // Get related materials from work_quantity_materials table
      const { data: relatedMaterials, error: relatedMaterialsError } = await supabase
        .from('work_quantity_materials')
        .select('project_material_id')
        .eq('project_work_quantity_id', item.id);
        
      if (relatedMaterialsError) {
        console.error("Error fetching related materials:", relatedMaterialsError);
        return {
          id: item.id,
          projectId,
          description: item.work_quantity_catalog.description,
          unit: item.work_quantity_catalog.unit,
          quantity: item.quantity,
          expectedExecutionDate: item.expected_execution_date,
          catalogId: item.work_quantity_id,
          materialIds: [] // Return empty array if there's an error
        };
      }

      // Extract just the material IDs from the related materials
      const materialIds = relatedMaterials.map(mat => mat.project_material_id);
      
      return {
        id: item.id,
        projectId,
        description: item.work_quantity_catalog.description,
        unit: item.work_quantity_catalog.unit,
        quantity: item.quantity,
        expectedExecutionDate: item.expected_execution_date,
        catalogId: item.work_quantity_id,
        materialIds: materialIds
      };
    }));

    return workQuantities;
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
