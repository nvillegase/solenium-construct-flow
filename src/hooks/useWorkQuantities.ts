
import { useState } from "react";
import { WorkQuantity } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useWorkQuantitiesDB } from "./useWorkQuantitiesDB";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkQuantities = (projectId: string) => {
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const { toast } = useToast();
  const { createWorkQuantity, fetchWorkQuantities } = useWorkQuantitiesDB();
  const queryClient = useQueryClient();

  const { data: workQuantities = [], isLoading, error } = useQuery({
    queryKey: ['workQuantities', projectId],
    queryFn: () => fetchWorkQuantities(projectId),
    enabled: !!projectId,
  });

  const addWorkQuantity = async () => {
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

    const tempWorkQuantities = [...workQuantities, newItem];
    queryClient.setQueryData(['workQuantities', projectId], tempWorkQuantities);
    setEditingQuantity(newItem.id);
  };

  const deleteWorkQuantity = (id: string) => {
    const filteredQuantities = workQuantities.filter(item => item.id !== id);
    queryClient.setQueryData(['workQuantities', projectId], filteredQuantities);
    toast({
      title: "Elemento eliminado",
      description: "La cantidad de obra ha sido eliminada"
    });
  };

  const updateWorkQuantity = (id: string, field: keyof WorkQuantity, value: string | number) => {
    const updatedQuantities = workQuantities.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    queryClient.setQueryData(['workQuantities', projectId], updatedQuantities);
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
      await createWorkQuantity(workQuantity);
      await queryClient.invalidateQueries({ queryKey: ['workQuantities', projectId] });
      setEditingQuantity(null);
    } catch (error) {
      console.error('Error saving work quantity:', error);
    }
  };

  return {
    workQuantities,
    editingQuantity,
    setEditingQuantity,
    addWorkQuantity,
    deleteWorkQuantity,
    updateWorkQuantity,
    saveWorkQuantity,
    isLoading,
    error
  };
};
