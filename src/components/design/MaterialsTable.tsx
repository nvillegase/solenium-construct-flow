import React from "react";
import { Material } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialCombobox } from "./MaterialCombobox";
import { useMaterialCatalog } from "@/hooks/useMaterialCatalog";

interface MaterialsTableProps {
  materials: Material[];
  editingMaterial: string | null;
  selectedProjectId: string;
  onAdd: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, field: keyof Material, value: string | number) => void;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  editingMaterial,
  selectedProjectId,
  onAdd,
  onSave,
  onDelete,
  onEdit,
  onUpdate
}) => {
  const { items: catalogItems, isLoading } = useMaterialCatalog();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Materiales Estimados</CardTitle>
        <Button onClick={onAdd} size="sm" className="bg-solenium-blue hover:bg-blue-600">
          <Plus size={16} className="mr-1" /> Agregar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="data-table">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Cantidad Estimada</th>
                <th className="text-center p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(material => (
                <tr key={material.id} className="border-b">
                  <td className="p-2" onClick={() => onEdit(material.id)}>
                    {editingMaterial === material.id ? (
                      <MaterialCombobox
                        items={catalogItems}
                        value={material.id}
                        onSelect={(selectedMaterial) => {
                          onUpdate(material.id, 'name', selectedMaterial.name);
                          onUpdate(material.id, 'unit', selectedMaterial.unit);
                        }}
                        isLoading={isLoading}
                      />
                    ) : (
                      material.name
                    )}
                  </td>
                  <td className="p-2 editable-cell" onClick={() => onEdit(material.id)}>
                    {editingMaterial === material.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={material.estimatedQuantity}
                        onChange={e => onUpdate(material.id, 'estimatedQuantity', parseFloat(e.target.value) || 0)}
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
                        onClick={onSave}
                        className="h-8 w-8 text-green-600"
                      >
                        <Save size={16} />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(material.id)}
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
          
          {materials.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No hay materiales definidos para este proyecto
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
