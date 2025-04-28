import { useState } from "react";
import { WorkQuantity } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useWorkQuantitiesDB } from "./useWorkQuantitiesDB";

export const useWorkQuantities = (initialWorkQuantities: WorkQuantity[] = []) => {
  const [workQuantities, setWorkQuantities] = useState<WorkQuantity[]>(
    initialWorkQuantities && Array.isArray(initialWorkQuantities) 
    ? initialWorkQuantities 
    : []
  );
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const { toast } = useToast();
  const { createWorkQuantity } = useWorkQuantitiesDB();

  const addWorkQuantity = async (projectId: string) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un proyecto primero",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: WorkQuantity = {
      id: `temp-${Date.now()}`,
      projectId,
      description: "",
      unit: "",
      quantity: 0,
      catalogId: ""
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

  const saveWorkQuantity = async (id: string) => {
    const workQuantity = workQuantities.find(item => item.id === id);
    if (!workQuantity) {
      toast({
        title: "Error",
        description: "No se encontró la cantidad de obra",
        variant: "destructive"
      });
      return;
    }

    try {
      const savedWorkQuantity = await createWorkQuantity(workQuantity);
      
      setWorkQuantities(prev => 
        prev.map(item => 
          item.id === id ? { ...item, id: savedWorkQuantity.id } : item
        )
      );
      
      setEditingQuantity(null);
    } catch (error) {
      console.error('Error saving work quantity:', error);
    }
  };

  return {
    workQuantities,
    setWorkQuantities,
    editingQuantity,
    setEditingQuantity,
    addWorkQuantity,
    deleteWorkQuantity,
    updateWorkQuantity,
    saveWorkQuantity
  };
};
