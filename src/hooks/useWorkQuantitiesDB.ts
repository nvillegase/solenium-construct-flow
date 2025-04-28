
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkQuantity } from "@/lib/types";

export const useWorkQuantitiesDB = () => {
  const { toast } = useToast();

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
  };
};
