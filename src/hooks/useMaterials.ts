
import { useState, useEffect } from "react";
import { Material } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { mockMaterials, mockMaterialCatalog } from "@/lib/mock-data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useMaterials = (initialProjectId?: string) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchMaterials = async (projectId?: string) => {
    if (!projectId) return [];
    
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Filter mock materials by project ID and enrich with catalog data
      const projectMaterials = mockMaterials
        .filter(material => material.projectId === projectId)
        .map(material => {
          const catalogItem = mockMaterialCatalog.find(cat => cat.name === material.name);
          return {
            ...material,
            materialCatalogId: catalogItem?.id
          };
        });
      
      return projectMaterials;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['materials', initialProjectId],
    queryFn: () => fetchMaterials(initialProjectId),
    enabled: !!initialProjectId,
    staleTime: 0
  });

  // Update materials state when query data changes
  useEffect(() => {
    if (data) {
      setMaterials(data);
    }
  }, [data]);

  const addMaterialMutation = useMutation({
    mutationFn: async ({ projectId, materialId, quantity }: { projectId: string, materialId: string, quantity: number }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const catalogItem = mockMaterialCatalog.find(cat => cat.id === materialId);
      if (!catalogItem) throw new Error("Material no encontrado en el catálogo");
      
      const newMaterial: Material = {
        id: `mat-${Date.now()}`,
        projectId,
        name: catalogItem.name,
        unit: catalogItem.unit,
        estimatedQuantity: quantity,
        receivedQuantity: 0,
        usedQuantity: 0,
        materialCatalogId: materialId
      };
      
      // Add to mock data
      mockMaterials.push(newMaterial);
      return newMaterial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', materials[0]?.projectId] });
      toast({
        title: "Material agregado",
        description: "El material ha sido agregado correctamente"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo agregar el material: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateMaterialMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string, field: keyof Material, value: string | number }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const materialIndex = mockMaterials.findIndex(m => m.id === id);
      if (materialIndex === -1) throw new Error("Material no encontrado");
      
      mockMaterials[materialIndex] = {
        ...mockMaterials[materialIndex],
        [field]: value
      };
      
      return mockMaterials[materialIndex];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', materials[0]?.projectId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el material: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const materialIndex = mockMaterials.findIndex(m => m.id === id);
      if (materialIndex === -1) throw new Error("Material no encontrado");
      
      mockMaterials.splice(materialIndex, 1);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', materials[0]?.projectId] });
      toast({
        title: "Material eliminado",
        description: "El material ha sido eliminado correctamente"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el material: " + error.message,
        variant: "destructive"
      });
    }
  });

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
      id: `temp-${Date.now()}`,
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
    if (id.startsWith('temp-')) {
      setMaterials(materials.filter(item => item.id !== id));
      toast({
        title: "Material eliminado",
        description: "El material ha sido eliminado"
      });
      return;
    }
    
    deleteMaterialMutation.mutate(id);
  };

  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(
      materials.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    
    if (!id.startsWith('temp-')) {
      updateMaterialMutation.mutate({ id, field, value });
    }
  };

  const saveMaterial = (id: string, materialCatalogId: string) => {
    const material = materials.find(m => m.id === id);
    
    if (!material) return;
    
    if (id.startsWith('temp-')) {
      addMaterialMutation.mutate({
        projectId: material.projectId,
        materialId: materialCatalogId,
        quantity: material.estimatedQuantity
      });
    }
    
    setEditingMaterial(null);
  };

  return {
    materials,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial,
    saveMaterial,
    isLoading,
    error,
  };
};
