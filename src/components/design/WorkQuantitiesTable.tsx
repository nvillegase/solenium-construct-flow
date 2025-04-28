
import React from "react";
import { WorkQuantity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkQuantityCatalog } from "@/hooks/useWorkQuantityCatalog";
import { WorkQuantityCombobox } from "./WorkQuantityCombobox";

interface WorkQuantitiesTableProps {
  workQuantities: WorkQuantity[];
  editingQuantity: string | null;
  selectedProjectId: string;
  isSupervisor: boolean;
  onAdd: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, field: keyof WorkQuantity, value: string | number) => void;
}

export const WorkQuantitiesTable: React.FC<WorkQuantitiesTableProps> = ({
  workQuantities,
  editingQuantity,
  selectedProjectId,
  isSupervisor,
  onAdd,
  onSave,
  onDelete,
  onEdit,
  onUpdate
}) => {
  const { catalog = [], isLoading } = useWorkQuantityCatalog();
  
  // Ensure catalog is always an array
  const safeCatalog = catalog && Array.isArray(catalog) ? catalog : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Cantidades de Obra</CardTitle>
        <Button onClick={onAdd} size="sm" className="bg-solenium-blue hover:bg-blue-600">
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
                  <td className="p-2" colSpan={2}>
                    {editingQuantity === item.id ? (
                      <WorkQuantityCombobox
                        items={safeCatalog}
                        value={item.catalogId}
                        isLoading={isLoading}
                        onSelect={(selected) => {
                          onUpdate(item.id, 'description', selected.description);
                          onUpdate(item.id, 'unit', selected.unit);
                          onUpdate(item.id, 'catalogId', selected.id);
                        }}
                      />
                    ) : (
                      <div onClick={() => onEdit(item.id)}>
                        <div>{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Unidad: {item.unit}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-2 editable-cell" onClick={() => onEdit(item.id)}>
                    {editingQuantity === item.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={e => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
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
                        onChange={e => onUpdate(item.id, 'expectedExecutionDate', e.target.value)}
                        className="max-w-xs"
                        disabled={!isSupervisor}
                      />
                    ) : (
                      <div onClick={isSupervisor ? () => onEdit(item.id) : undefined}>
                        {item.expectedExecutionDate || (isSupervisor ? "No definida" : "N/A")}
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {editingQuantity === item.id ? (
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
                        onClick={() => onDelete(item.id)}
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
          
          {workQuantities.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No hay cantidades de obra definidas para este proyecto
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
