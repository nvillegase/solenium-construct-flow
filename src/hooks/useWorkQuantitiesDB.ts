
import { useToast } from "@/hooks/use-toast";
import { mockWorkQuantities, mockWorkQuantityCatalog, mockWorkQuantityMaterials } from "@/lib/mock-data";
import { WorkQuantity } from "@/lib/types";

export const useWorkQuantitiesDB = () => {
  const { toast } = useToast();

  const fetchWorkQuantities = async (projectId: string) => {
    if (!projectId) return [];
    
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Filter work quantities by project and enrich with catalog and material data
      const workQuantities = mockWorkQuantities
        .filter(wq => wq.projectId === projectId)
        .map(wq => {
          const catalogItem = mockWorkQuantityCatalog.find(cat => cat.id === wq.catalogId);
          const materialRelation = mockWorkQuantityMaterials.find(rel => rel.workQuantityId === wq.id);
          
          return {
            ...wq,
            description: catalogItem?.description || wq.description,
            unit: catalogItem?.unit || wq.unit,
            materialIds: materialRelation?.materialIds || wq.materialIds
          };
        });

      return workQuantities;
    } catch (error) {
      console.error("Error in fetchWorkQuantities:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cantidades de obra",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createWorkQuantity = async (workQuantity: Omit<WorkQuantity, 'id'>) => {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newWorkQuantity: WorkQuantity = {
        ...workQuantity,
        id: `wq-${Date.now()}`
      };
      
      // Add to mock data
      mockWorkQuantities.push(newWorkQuantity);

      toast({
        title: "Cantidad de obra creada",
        description: "La cantidad de obra ha sido guardada exitosamente",
      });

      return newWorkQuantity;
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
