
import { useState } from "react";
import { WorkQuantity } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export const useWorkQuantities = (initialWorkQuantities: WorkQuantity[] = []) => {
  const [workQuantities, setWorkQuantities] = useState<WorkQuantity[]>(initialWorkQuantities);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const { toast } = useToast();

  const addWorkQuantity = (projectId: string) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un proyecto primero",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: WorkQuantity = {
      id: `wq-${Date.now()}`,
      projectId,
      description: "Nueva actividad",
      unit: "unidad",
      quantity: 0
    };
    setWorkQuantities([...workQuantities, newItem]);
    setEditingQuantity(newItem.id);
  };

  const deleteWorkQuantity = (id: string) => {
    setWorkQuantities(workQuantities.filter(item => item.id !== id));
    toast({
      title: "Elemento eliminado",
      description: "La cantidad de obra ha sido eliminada"
    });
  };

  const updateWorkQuantity = (id: string, field: keyof WorkQuantity, value: string | number) => {
    setWorkQuantities(
      workQuantities.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return {
    workQuantities,
    setWorkQuantities,
    editingQuantity,
    setEditingQuantity,
    addWorkQuantity,
    deleteWorkQuantity,
    updateWorkQuantity
  };
};
