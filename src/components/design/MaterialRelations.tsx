
import React from "react";
import { WorkQuantity, Material } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, AlertTriangle, Trash } from "lucide-react";

interface MaterialRelationsProps {
  workQuantities: WorkQuantity[];
  materials: Material[];
  selectedQuantityForMaterials: string | null;
  selectedMaterials: string[];
  onQuantitySelect: (id: string) => void;
  onMaterialSelect: (id: string, selected: boolean) => void;
  onAssociateMaterials: () => void;
  onRemoveMaterialFromWorkQuantity: (workQuantityId: string, materialId: string) => void;
  getWorkQuantitiesWithoutMaterials: () => WorkQuantity[];
  getUnrelatedMaterials: () => Material[];
}

export const MaterialRelations: React.FC<MaterialRelationsProps> = ({
  workQuantities,
  materials,
  selectedQuantityForMaterials,
  selectedMaterials,
  onQuantitySelect,
  onMaterialSelect,
  onAssociateMaterials,
  onRemoveMaterialFromWorkQuantity,
  getWorkQuantitiesWithoutMaterials,
  getUnrelatedMaterials
}) => {
  return (
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
              onValueChange={onQuantitySelect}
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
                                <li key={matId} className="flex items-center justify-between">
                                  <span>{mat ? mat.name : 'Material desconocido'}</span>
                                  <Button
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => onRemoveMaterialFromWorkQuantity(selected.id, matId)}
                                    className="h-6 w-6 text-red-500"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </li>
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
                    onChange={e => onMaterialSelect(material.id, e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor={`mat-select-${material.id}`} className="flex-1 cursor-pointer">
                    {material.name} ({material.unit})
                  </label>
                </div>
              ))}
              
              {materials.length === 0 && (
                <div className="p-3 text-gray-500 text-center">
                  No hay materiales disponibles
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onAssociateMaterials} 
            className="bg-solenium-blue hover:bg-blue-600"
            disabled={!selectedQuantityForMaterials || selectedMaterials.length === 0}
          >
            <Link size={16} className="mr-2" />
            Asociar Materiales
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <AlertTriangle size={16} className="text-amber-500" />
              Actividades sin materiales
            </h3>
            <div className="border rounded-md p-3 max-h-[250px] overflow-y-auto">
              {getWorkQuantitiesWithoutMaterials().length > 0 ? (
                <ul className="space-y-1">
                  {getWorkQuantitiesWithoutMaterials().map(wq => (
                    <li key={wq.id} className="py-1 border-b last:border-0">
                      <span className="font-medium">{wq.description}</span>
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                        <span>{wq.quantity} {wq.unit}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">Todas las actividades tienen materiales asociados</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <AlertTriangle size={16} className="text-amber-500" />
              Materiales sin actividades
            </h3>
            <div className="border rounded-md p-3 max-h-[250px] overflow-y-auto">
              {getUnrelatedMaterials().length > 0 ? (
                <ul className="space-y-1">
                  {getUnrelatedMaterials().map(mat => (
                    <li key={mat.id} className="py-1 border-b last:border-0">
                      <span className="font-medium">{mat.name}</span>
                      <div className="text-xs text-gray-500">
                        {mat.estimatedQuantity} {mat.unit}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">Todos los materiales están asociados a actividades</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
