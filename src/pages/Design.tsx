
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Trash, Link } from "lucide-react";
import { mockWorkQuantities as initialWorkQuantities, mockMaterials as initialMaterials } from "@/lib/mock-data";
import { WorkQuantity, Material } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Design = () => {
  const [workQuantities, setWorkQuantities] = useState<WorkQuantity[]>(initialWorkQuantities);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const isSupervisor = hasRole("Supervisor");
  
  // State for material-activity relations
  const [selectedQuantityForMaterials, setSelectedQuantityForMaterials] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  
  // Add a new work quantity
  const addWorkQuantity = () => {
    const newItem: WorkQuantity = {
      id: `wq-${Date.now()}`,
      projectId: "project-1", // Default project ID
      description: "Nueva actividad",
      unit: "unidad",
      quantity: 0
    };
    setWorkQuantities([...workQuantities, newItem]);
    setEditingQuantity(newItem.id);
  };
  
  // Delete a work quantity
  const deleteWorkQuantity = (id: string) => {
    setWorkQuantities(workQuantities.filter(item => item.id !== id));
    toast({
      title: "Elemento eliminado",
      description: "La cantidad de obra ha sido eliminada"
    });
  };
  
  // Update a work quantity
  const updateWorkQuantity = (id: string, field: keyof WorkQuantity, value: string | number) => {
    setWorkQuantities(
      workQuantities.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  // Add a new material
  const addMaterial = () => {
    const newItem: Material = {
      id: `mat-${Date.now()}`,
      projectId: "project-1", // Default project ID
      name: "Nuevo material",
      unit: "unidad",
      estimatedQuantity: 0,
      receivedQuantity: 0,
      usedQuantity: 0
    };
    setMaterials([...materials, newItem]);
    setEditingMaterial(newItem.id);
  };
  
  // Delete a material
  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(item => item.id !== id));
    toast({
      title: "Material eliminado",
      description: "El material ha sido eliminado"
    });
  };
  
  // Update a material
  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(
      materials.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  // Save changes
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
  
  // Associate materials with work quantity
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
    
    // Update work quantity with selected materials
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
    
    // Reset selection
    setSelectedQuantityForMaterials(null);
    setSelectedMaterials([]);
  };
  
  return (
    <AppLayout requiredRoles={["Diseñador", "Supervisor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Diseño del Proyecto</h1>
        
        <Tabs defaultValue="quantities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quantities">Cantidades de Obra</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
            <TabsTrigger value="relations">Relaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quantities">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Cantidades de Obra</CardTitle>
                <Button onClick={addWorkQuantity} size="sm" className="bg-solenium-blue hover:bg-blue-600">
                  <Plus size={16} className="mr-1" /> Agregar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Descripción</th>
                        <th className="text-left p-2">Unidad</th>
                        <th className="text-left p-2">Cantidad</th>
                        <th className="text-left p-2">Fecha Esperada</th>
                        <th className="text-center p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workQuantities.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2 editable-cell" onClick={() => setEditingQuantity(item.id)}>
                            {editingQuantity === item.id ? (
                              <Input
                                value={item.description}
                                onChange={e => updateWorkQuantity(item.id, 'description', e.target.value)}
                                autoFocus
                                className="max-w-xs"
                              />
                            ) : (
                              item.description
                            )}
                          </td>
                          <td className="p-2 editable-cell" onClick={() => setEditingQuantity(item.id)}>
                            {editingQuantity === item.id ? (
                              <Input
                                value={item.unit}
                                onChange={e => updateWorkQuantity(item.id, 'unit', e.target.value)}
                                className="max-w-xs"
                              />
                            ) : (
                              item.unit
                            )}
                          </td>
                          <td className="p-2 editable-cell" onClick={() => setEditingQuantity(item.id)}>
                            {editingQuantity === item.id ? (
                              <Input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={e => updateWorkQuantity(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="max-w-xs"
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td className="p-2 editable-cell">
                            {editingQuantity === item.id && isSupervisor ? (
                              <Input
                                type="date"
                                value={item.expectedExecutionDate || ''}
                                onChange={e => updateWorkQuantity(item.id, 'expectedExecutionDate', e.target.value)}
                                className="max-w-xs"
                                disabled={!isSupervisor}
                              />
                            ) : (
                              <div onClick={isSupervisor ? () => setEditingQuantity(item.id) : undefined}>
                                {item.expectedExecutionDate || (isSupervisor ? "No definida" : "N/A")}
                              </div>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {editingQuantity === item.id ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => saveChanges('workQuantities')}
                                className="h-8 w-8 text-green-600"
                              >
                                <Save size={16} />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteWorkQuantity(item.id)}
                                className="h-8 w-8 text-red-500"
                              >
                                <Trash size={16} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Materiales Estimados</CardTitle>
                <Button onClick={addMaterial} size="sm" className="bg-solenium-blue hover:bg-blue-600">
                  <Plus size={16} className="mr-1" /> Agregar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Unidad</th>
                        <th className="text-left p-2">Cantidad Estimada</th>
                        <th className="text-center p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map(material => (
                        <tr key={material.id} className="border-b">
                          <td className="p-2 editable-cell" onClick={() => setEditingMaterial(material.id)}>
                            {editingMaterial === material.id ? (
                              <Input
                                value={material.name}
                                onChange={e => updateMaterial(material.id, 'name', e.target.value)}
                                autoFocus
                                className="max-w-xs"
                              />
                            ) : (
                              material.name
                            )}
                          </td>
                          <td className="p-2 editable-cell" onClick={() => setEditingMaterial(material.id)}>
                            {editingMaterial === material.id ? (
                              <Input
                                value={material.unit}
                                onChange={e => updateMaterial(material.id, 'unit', e.target.value)}
                                className="max-w-xs"
                              />
                            ) : (
                              material.unit
                            )}
                          </td>
                          <td className="p-2 editable-cell" onClick={() => setEditingMaterial(material.id)}>
                            {editingMaterial === material.id ? (
                              <Input
                                type="number"
                                min="0"
                                value={material.estimatedQuantity}
                                onChange={e => updateMaterial(material.id, 'estimatedQuantity', parseFloat(e.target.value) || 0)}
                                className="max-w-xs"
                              />
                            ) : (
                              material.estimatedQuantity
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {editingMaterial === material.id ? (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => saveChanges('materials')}
                                className="h-8 w-8 text-green-600"
                              >
                                <Save size={16} />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteMaterial(material.id)}
                                className="h-8 w-8 text-red-500"
                              >
                                <Trash size={16} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="relations">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Link size={20} />
                  Relación Cantidades de Obra - Materiales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">1. Seleccionar Cantidad de Obra</h3>
                    <Select
                      value={selectedQuantityForMaterials || ""}
                      onValueChange={setSelectedQuantityForMaterials}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cantidad de obra" />
                      </SelectTrigger>
                      <SelectContent>
                        {workQuantities.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedQuantityForMaterials && (
                      <div className="p-3 bg-gray-50 rounded border text-sm">
                        {(() => {
                          const selected = workQuantities.find(wq => wq.id === selectedQuantityForMaterials);
                          if (!selected) return null;
                          
                          return (
                            <div className="space-y-1">
                              <p>Descripción: <span className="font-medium">{selected.description}</span></p>
                              <p>Unidad: <span className="font-medium">{selected.unit}</span></p>
                              <p>Cantidad: <span className="font-medium">{selected.quantity}</span></p>
                              {selected.materialIds && selected.materialIds.length > 0 && (
                                <div>
                                  <p className="mt-2">Materiales ya asociados:</p>
                                  <ul className="list-disc list-inside">
                                    {selected.materialIds.map(matId => {
                                      const mat = materials.find(m => m.id === matId);
                                      return (
                                        <li key={matId}>{mat ? mat.name : 'Material desconocido'}</li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. Seleccionar Materiales Requeridos</h3>
                    <div className="max-h-[300px] overflow-y-auto border rounded">
                      {materials.map(material => (
                        <div key={material.id} className="flex items-center p-2 border-b">
                          <input
                            type="checkbox"
                            id={`mat-select-${material.id}`}
                            checked={selectedMaterials.includes(material.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedMaterials([...selectedMaterials, material.id]);
                              } else {
                                setSelectedMaterials(selectedMaterials.filter(id => id !== material.id));
                              }
                            }}
                            className="mr-3"
                          />
                          <label htmlFor={`mat-select-${material.id}`} className="flex-1 cursor-pointer">
                            {material.name} ({material.unit})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={associateMaterials} className="bg-solenium-blue hover:bg-blue-600">
                    <Link size={16} className="mr-2" />
                    Asociar Materiales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Design;
