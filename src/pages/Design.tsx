
import React, { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockWorkQuantities as initialWorkQuantities, mockMaterials as initialMaterials } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useWorkQuantities } from "@/hooks/useWorkQuantities";
import { useMaterials } from "@/hooks/useMaterials";
import { useToast } from "@/components/ui/use-toast";
import { WorkQuantitiesTable } from "@/components/design/WorkQuantitiesTable";
import { MaterialsTable } from "@/components/design/MaterialsTable";
import { MaterialRelations } from "@/components/design/MaterialRelations";

const Design = () => {
  const { projects, selectedProjectId, setSelectedProjectId, isLoading } = useProjects();
  const [selectedTabKey, setSelectedTabKey] = React.useState<string>("quantities");
  const [selectedQuantityForMaterials, setSelectedQuantityForMaterials] = React.useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const isSupervisor = hasRole("Supervisor");
  
  const {
    workQuantities,
    setWorkQuantities,
    editingQuantity,
    setEditingQuantity,
    addWorkQuantity,
    deleteWorkQuantity,
    updateWorkQuantity
  } = useWorkQuantities();

  const {
    materials,
    setMaterials,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    deleteMaterial,
    updateMaterial
  } = useMaterials();
  
  useEffect(() => {
    if (selectedProjectId) {
      setWorkQuantities(initialWorkQuantities.filter(item => item.projectId === selectedProjectId));
      setMaterials(initialMaterials.filter(item => item.projectId === selectedProjectId));
    } else {
      setWorkQuantities([]);
      setMaterials([]);
    }
    setEditingQuantity(null);
    setEditingMaterial(null);
    setSelectedQuantityForMaterials(null);
    setSelectedMaterials([]);
  }, [selectedProjectId]);

  const saveChanges = (type: 'workQuantities' | 'materials') => {
    toast({
      title: "Cambios guardados",
      description: type === 'workQuantities' 
        ? "Cantidades de obra actualizadas correctamente" 
        : "Lista de materiales actualizada correctamente"
    });
    if (type === 'workQuantities') {
      setEditingQuantity(null);
    } else {
      setEditingMaterial(null);
    }
  };

  const associateMaterials = () => {
    if (!selectedQuantityForMaterials) {
      toast({
        title: "Error",
        description: "Debe seleccionar una cantidad de obra",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedMaterials.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un material",
        variant: "destructive"
      });
      return;
    }
    
    setWorkQuantities(
      workQuantities.map(item => 
        item.id === selectedQuantityForMaterials 
          ? { ...item, materialIds: selectedMaterials } 
          : item
      )
    );
    
    toast({
      title: "Materiales asociados",
      description: `Se han asociado ${selectedMaterials.length} materiales a la cantidad de obra`
    });
    
    setSelectedQuantityForMaterials(null);
    setSelectedMaterials([]);
  };

  const removeMaterialFromWorkQuantity = (workQuantityId: string, materialId: string) => {
    setWorkQuantities(
      workQuantities.map(item => {
        if (item.id === workQuantityId && item.materialIds) {
          return { 
            ...item, 
            materialIds: item.materialIds.filter(id => id !== materialId)
          };
        }
        return item;
      })
    );
    
    toast({
      title: "Material desasociado",
      description: "Se ha eliminado la asociación de material correctamente"
    });
  };

  const getUnrelatedMaterials = () => {
    const allMaterialsWithRelations = workQuantities
      .flatMap(wq => wq.materialIds || [])
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return materials.filter(mat => !allMaterialsWithRelations.includes(mat.id));
  };

  const getWorkQuantitiesWithoutMaterials = () => {
    return workQuantities.filter(wq => !wq.materialIds || wq.materialIds.length === 0);
  };

  return (
    <AppLayout requiredRoles={["Diseñador", "Supervisor"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold">Diseño del Proyecto</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Proyecto actual:</span>
            {isLoading ? (
              <div className="w-[200px] h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <Select
                value={selectedProjectId || ""}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <Tabs 
          defaultValue={selectedTabKey} 
          value={selectedTabKey}
          onValueChange={setSelectedTabKey}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quantities">Cantidades de Obra</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
            <TabsTrigger value="relations">Relaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quantities">
            <WorkQuantitiesTable
              workQuantities={workQuantities}
              editingQuantity={editingQuantity}
              selectedProjectId={selectedProjectId}
              isSupervisor={isSupervisor}
              onAdd={() => addWorkQuantity(selectedProjectId)}
              onSave={() => saveChanges('workQuantities')}
              onDelete={deleteWorkQuantity}
              onEdit={setEditingQuantity}
              onUpdate={updateWorkQuantity}
            />
          </TabsContent>
          
          <TabsContent value="materials">
            <MaterialsTable
              materials={materials}
              editingMaterial={editingMaterial}
              selectedProjectId={selectedProjectId}
              onAdd={() => addMaterial(selectedProjectId)}
              onSave={() => saveChanges('materials')}
              onDelete={deleteMaterial}
              onEdit={setEditingMaterial}
              onUpdate={updateMaterial}
            />
          </TabsContent>
          
          <TabsContent value="relations">
            <MaterialRelations
              workQuantities={workQuantities}
              materials={materials}
              selectedQuantityForMaterials={selectedQuantityForMaterials}
              selectedMaterials={selectedMaterials}
              onQuantitySelect={setSelectedQuantityForMaterials}
              onMaterialSelect={(id, selected) => {
                if (selected) {
                  setSelectedMaterials([...selectedMaterials, id]);
                } else {
                  setSelectedMaterials(selectedMaterials.filter(matId => matId !== id));
                }
              }}
              onAssociateMaterials={associateMaterials}
              onRemoveMaterialFromWorkQuantity={removeMaterialFromWorkQuantity}
              getWorkQuantitiesWithoutMaterials={getWorkQuantitiesWithoutMaterials}
              getUnrelatedMaterials={getUnrelatedMaterials}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Design;
