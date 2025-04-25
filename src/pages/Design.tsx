
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Trash } from "lucide-react";
import { mockWorkQuantities as initialWorkQuantities, mockMaterials as initialMaterials } from "@/lib/mock-data";
import { WorkQuantity, Material } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const Design = () => {
  const [workQuantities, setWorkQuantities] = useState<WorkQuantity[]>(initialWorkQuantities);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Add a new work quantity
  const addWorkQuantity = () => {
    const newItem: WorkQuantity = {
      id: `wq-${Date.now()}`,
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
  
  return (
    <AppLayout requiredRoles={["Diseñador", "Supervisor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Diseño del Proyecto</h1>
        
        <Tabs defaultValue="quantities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quantities">Cantidades de Obra</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
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
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Design;
