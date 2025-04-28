
import { useState } from "react";
import { Material } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export const useMaterials = (initialMaterials: Material[] = []) => {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const { toast } = useToast();

  const addMaterial = (projectId?: string) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un proyecto primero",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: Material = {
      id: `mat-${Date.now()}`,
      projectId,
      name: "Nuevo material",
      unit: "unidad",
      estimatedQuantity: 0,
      receivedQuantity: 0,
      usedQuantity: 0
    };
    setMaterials([...materials, newItem]);
    setEditingMaterial(newItem.id);
  };

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(item => item.id !== id));
    toast({
      title: "Material eliminado",
      description: "El material ha sido eliminado"
    });
  };

  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(
      materials.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return {
    materials,
    setMaterials,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial
  };
};
