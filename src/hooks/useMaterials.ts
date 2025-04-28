import { useState, useEffect } from "react";
import { Material } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useMaterials = (initialMaterials: Material[] = []) => {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchMaterials = async (projectId?: string) => {
    if (!projectId) return [];
    
    try {
      const { data: projectMaterials, error } = await supabase
        .from('project_materials')
        .select(`
          id,
          material_id,
          estimated_quantity,
          received_quantity,
          used_quantity,
          material_catalog (
            name,
            unit
          )
        `)
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      return projectMaterials.map(item => ({
        id: item.id,
        projectId,
        name: item.material_catalog.name,
        unit: item.material_catalog.unit,
        estimatedQuantity: item.estimated_quantity,
        receivedQuantity: item.received_quantity,
        usedQuantity: item.used_quantity,
        materialCatalogId: item.material_id
      }));
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['materials', materials[0]?.projectId],
    queryFn: () => fetchMaterials(materials[0]?.projectId),
    enabled: !!materials[0]?.projectId
  });

  useEffect(() => {
    if (data) {
      setMaterials(data);
    }
  }, [data]);

  const addMaterialMutation = useMutation({
    mutationFn: async ({ projectId, materialId, quantity }: { projectId: string, materialId: string, quantity: number }) => {
      const { data, error } = await supabase
        .from('project_materials')
        .insert({
          project_id: projectId,
          material_id: materialId,
          estimated_quantity: quantity
        })
        .select('*');
      
      if (error) throw error;
      return data[0];
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
      const fieldMapping: Record<string, string> = {
        estimatedQuantity: 'estimated_quantity',
        receivedQuantity: 'received_quantity',
        usedQuantity: 'used_quantity',
      };
      
      const dbField = fieldMapping[field] || field;
      
      const { data, error } = await supabase
        .from('project_materials')
        .update({ [dbField]: value })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
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
      const { error } = await supabase
        .from('project_materials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
      
      setMaterials(materials.filter(m => m.id !== id));
    }
    
    setEditingMaterial(null);
  };

  return {
    materials,
    setMaterials,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial,
    saveMaterial,
    isLoading,
    error,
    refetch
  };
};
