
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockMaterials } from "@/lib/mock-data";
import { MaterialDelivery } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface MaterialDeliveryFormProps {
  onSubmit: (delivery: MaterialDelivery) => void;
  projects: any[];
  receptions: any[];
  deliveries: any[];
}

const MaterialDeliveryForm = ({ onSubmit, projects, receptions, deliveries }: MaterialDeliveryFormProps) => {
  const { toast } = useToast();
  const [isRelocation, setIsRelocation] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    materialId: "",
    receivedBy: "",
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
    isRelocation: false,
    destinationProjectId: ""
  });

  const resetForm = () => {
    setNewDelivery({
      materialId: "",
      receivedBy: "",
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
      isRelocation: false,
      destinationProjectId: ""
    });
    setIsRelocation(false);
  };

  const createDelivery = () => {
    if (!newDelivery.materialId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un material",
        variant: "destructive"
      });
      return;
    }
    
    if (!newDelivery.receivedBy.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar el nombre de quien recibe el material",
        variant: "destructive"
      });
      return;
    }
    
    if (newDelivery.quantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a cero",
        variant: "destructive"
      });
      return;
    }

    if (isRelocation && !newDelivery.destinationProjectId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un proyecto destino",
        variant: "destructive"
      });
      return;
    }
    
    const selectedMaterial = mockMaterials.find(m => m.id === newDelivery.materialId);
    
    if (!selectedMaterial) {
      toast({
        title: "Error",
        description: "Material no encontrado",
        variant: "destructive"
      });
      return;
    }
    
    const totalReceived = receptions
      .filter(r => r.materialId === newDelivery.materialId)
      .reduce((sum, r) => sum + r.quantity, 0);
      
    const totalDelivered = deliveries
      .filter(d => d.materialId === newDelivery.materialId)
      .reduce((sum, d) => sum + d.quantity, 0);
    
    const availableQuantity = totalReceived - totalDelivered;
    
    if (newDelivery.quantity > availableQuantity) {
      toast({
        title: "Error",
        description: `Solo hay ${availableQuantity} unidades disponibles de este material`,
        variant: "destructive"
      });
      return;
    }
    
    const newDeliveryRecord: MaterialDelivery = {
      id: `del-${Date.now()}`,
      projectId: selectedMaterial.projectId,
      materialId: newDelivery.materialId,
      materialName: selectedMaterial.name,
      receivedBy: newDelivery.receivedBy,
      quantity: newDelivery.quantity,
      date: newDelivery.date
    };
    
    onSubmit(newDeliveryRecord);
    
    toast({
      title: "Entrega registrada",
      description: `Se ha registrado la entrega de ${newDeliveryRecord.quantity} unidades de ${selectedMaterial.name}`
    });
    
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Entrega de Materiales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-material">Material</Label>
            <Select
              value={newDelivery.materialId}
              onValueChange={(value) => setNewDelivery({...newDelivery, materialId: value})}
            >
              <SelectTrigger id="delivery-material">
                <SelectValue placeholder="Seleccionar material" />
              </SelectTrigger>
              <SelectContent>
                {mockMaterials.map(material => {
                  const totalReceived = receptions
                    .filter(r => r.materialId === material.id)
                    .reduce((sum, r) => sum + r.quantity, 0);
                    
                  const totalDelivered = deliveries
                    .filter(d => d.materialId === material.id)
                    .reduce((sum, d) => sum + d.quantity, 0);
                  
                  const availableQuantity = totalReceived - totalDelivered;
                  
                  return (
                    <SelectItem 
                      key={material.id} 
                      value={material.id}
                      disabled={availableQuantity <= 0}
                    >
                      {material.name} ({availableQuantity} disponibles)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delivery-date">Fecha de Entrega</Label>
            <Input
              id="delivery-date"
              type="date"
              value={newDelivery.date}
              onChange={e => setNewDelivery({...newDelivery, date: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-receiver">Entregado a</Label>
            <Input
              id="delivery-receiver"
              placeholder="Nombre de quien recibe"
              value={newDelivery.receivedBy}
              onChange={e => setNewDelivery({...newDelivery, receivedBy: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delivery-quantity">Cantidad</Label>
            <Input
              id="delivery-quantity"
              type="number"
              min="1"
              value={newDelivery.quantity}
              onChange={e => setNewDelivery({...newDelivery, quantity: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="relocation"
            checked={isRelocation}
            onCheckedChange={(checked) => {
              setIsRelocation(checked as boolean);
              setNewDelivery({
                ...newDelivery,
                isRelocation: checked as boolean,
                destinationProjectId: checked ? newDelivery.destinationProjectId : ""
              });
            }}
          />
          <Label htmlFor="relocation">Reubicación de material</Label>
        </div>

        {isRelocation && (
          <div className="space-y-2">
            <Label htmlFor="destination-project">Proyecto</Label>
            <Select
              value={newDelivery.destinationProjectId}
              onValueChange={(value) => setNewDelivery({...newDelivery, destinationProjectId: value})}
            >
              <SelectTrigger id="destination-project">
                <SelectValue placeholder="Seleccionar proyecto destino" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetForm}>
          Limpiar
        </Button>
        <Button onClick={createDelivery} className="bg-solenium-blue hover:bg-blue-600">
          Registrar Entrega
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialDeliveryForm;

