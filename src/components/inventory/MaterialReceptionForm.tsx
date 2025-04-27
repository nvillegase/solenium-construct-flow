
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockMaterials, mockPurchaseOrders } from "@/lib/mock-data";
import { MaterialReception } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface MaterialReceptionFormProps {
  onSubmit: (reception: MaterialReception) => void;
}

const MaterialReceptionForm = ({ onSubmit }: MaterialReceptionFormProps) => {
  const { toast } = useToast();
  const [newReception, setNewReception] = useState({
    orderId: "",
    materialId: "",
    quantity: 0,
    status: "Bueno",
    date: new Date().toISOString().split('T')[0],
    observation: ""
  });

  const resetForm = () => {
    setNewReception({
      orderId: "",
      materialId: "",
      quantity: 0,
      status: "Bueno",
      date: new Date().toISOString().split('T')[0],
      observation: ""
    });
  };

  const createReception = () => {
    if (!newReception.orderId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una orden de compra",
        variant: "destructive"
      });
      return;
    }
    
    if (!newReception.materialId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un material",
        variant: "destructive"
      });
      return;
    }
    
    if (newReception.quantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a cero",
        variant: "destructive"
      });
      return;
    }
    
    const selectedMaterial = mockMaterials.find(m => m.id === newReception.materialId);
    const materialName = selectedMaterial?.name || "Material desconocido";
    const projectId = selectedMaterial?.projectId || "project-1";
    
    const newReceptionRecord: MaterialReception = {
      id: `rec-${Date.now()}`,
      projectId: projectId,
      orderId: newReception.orderId,
      materialId: newReception.materialId,
      materialName,
      quantity: newReception.quantity,
      status: newReception.status as "Bueno" | "Regular" | "Defectuoso",
      date: newReception.date,
      observation: newReception.observation
    };
    
    onSubmit(newReceptionRecord);
    
    toast({
      title: "Recepción registrada",
      description: `Se ha registrado la recepción de ${newReceptionRecord.quantity} unidades de ${materialName}`
    });
    
    resetForm();
  };

  const availableOrders = mockPurchaseOrders.filter(
    order => order.status === "En Tránsito" || order.status === "Pendiente" || order.status === "Recibido Parcial"
  );

  const getFilteredMaterials = (orderId: string) => {
    const order = mockPurchaseOrders.find(o => o.id === orderId);
    return order?.materials.map(m => m.materialId) || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Recepción de Materiales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reception-order">Orden de Compra</Label>
            <Select
              value={newReception.orderId}
              onValueChange={(value) => setNewReception({...newReception, orderId: value, materialId: ""})}
            >
              <SelectTrigger id="reception-order">
                <SelectValue placeholder="Seleccionar orden" />
              </SelectTrigger>
              <SelectContent>
                {availableOrders.map(order => (
                  <SelectItem key={order.id} value={order.id}>
                    #{order.id.substring(3, 8)} - {order.supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reception-date">Fecha de Recepción</Label>
            <Input
              id="reception-date"
              type="date"
              value={newReception.date}
              onChange={e => setNewReception({...newReception, date: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reception-material">Material</Label>
            <Select
              value={newReception.materialId}
              onValueChange={(value) => setNewReception({...newReception, materialId: value})}
              disabled={!newReception.orderId}
            >
              <SelectTrigger id="reception-material">
                <SelectValue placeholder={newReception.orderId ? "Seleccionar material" : "Primero seleccione una orden"} />
              </SelectTrigger>
              <SelectContent>
                {newReception.orderId && mockMaterials
                  .filter(material => getFilteredMaterials(newReception.orderId).includes(material.id))
                  .map(material => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reception-quantity">Cantidad</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="reception-quantity"
                type="number"
                min="1"
                value={newReception.quantity}
                onChange={e => setNewReception({...newReception, quantity: parseInt(e.target.value)})}
              />
              <span className="text-sm text-gray-500">
                {newReception.materialId
                  ? mockMaterials.find(m => m.id === newReception.materialId)?.unit || "unidad"
                  : ""}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reception-status">Estado</Label>
            <Select
              value={newReception.status}
              onValueChange={(value) => setNewReception({...newReception, status: value})}
            >
              <SelectTrigger id="reception-status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bueno">Bueno</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Defectuoso">Defectuoso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reception-observation">Observaciones</Label>
          <Textarea
            id="reception-observation"
            placeholder="Ingrese cualquier observación relevante"
            value={newReception.observation}
            onChange={e => setNewReception({...newReception, observation: e.target.value})}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetForm}>
          Limpiar
        </Button>
        <Button onClick={createReception} className="bg-solenium-blue hover:bg-blue-600">
          Registrar Recepción
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialReceptionForm;

