
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockMaterials, mockMaterialReceptions, mockMaterialDeliveries, mockPurchaseOrders } from "@/lib/mock-data";
import { MaterialReception, MaterialDelivery } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const Inventory = () => {
  const [receptions, setReceptions] = useState<MaterialReception[]>(mockMaterialReceptions);
  const [deliveries, setDeliveries] = useState<MaterialDelivery[]>(mockMaterialDeliveries);
  const { toast } = useToast();
  
  // Form states
  const [newReception, setNewReception] = useState({
    orderId: "",
    materialId: "",
    quantity: 0,
    status: "Bueno",
    date: new Date().toISOString().split('T')[0],
    observation: ""
  });
  
  const [newDelivery, setNewDelivery] = useState({
    materialId: "",
    receivedBy: "",
    quantity: 0,
    date: new Date().toISOString().split('T')[0]
  });
  
  // Reset form functions
  const resetReceptionForm = () => {
    setNewReception({
      orderId: "",
      materialId: "",
      quantity: 0,
      status: "Bueno",
      date: new Date().toISOString().split('T')[0],
      observation: ""
    });
  };
  
  const resetDeliveryForm = () => {
    setNewDelivery({
      materialId: "",
      receivedBy: "",
      quantity: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  // Create new reception
  const createReception = () => {
    // Validation
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
    
    // Create new reception record
    const selectedMaterial = mockMaterials.find(m => m.id === newReception.materialId);
    const materialName = selectedMaterial?.name || "Material desconocido";
    
    const newReceptionRecord: MaterialReception = {
      id: `rec-${Date.now()}`,
      orderId: newReception.orderId,
      materialId: newReception.materialId,
      materialName,
      quantity: newReception.quantity,
      status: newReception.status as "Bueno" | "Regular" | "Defectuoso",
      date: newReception.date,
      observation: newReception.observation
    };
    
    setReceptions([newReceptionRecord, ...receptions]);
    
    toast({
      title: "Recepción registrada",
      description: `Se ha registrado la recepción de ${newReceptionRecord.quantity} unidades de ${materialName}`
    });
    
    resetReceptionForm();
  };
  
  // Create new delivery
  const createDelivery = () => {
    // Validation
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
    
    // Check available quantity
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
    
    // Create new delivery record
    const newDeliveryRecord: MaterialDelivery = {
      id: `del-${Date.now()}`,
      materialId: newDelivery.materialId,
      materialName: selectedMaterial.name,
      receivedBy: newDelivery.receivedBy,
      quantity: newDelivery.quantity,
      date: newDelivery.date
    };
    
    setDeliveries([newDeliveryRecord, ...deliveries]);
    
    toast({
      title: "Entrega registrada",
      description: `Se ha registrado la entrega de ${newDeliveryRecord.quantity} unidades de ${selectedMaterial.name}`
    });
    
    resetDeliveryForm();
  };
  
  // Filter orders and materials that are pending or partial
  const availableOrders = mockPurchaseOrders.filter(
    order => order.status === "En Tránsito" || order.status === "Pendiente" || order.status === "Recibido Parcial"
  );
  
  // Filter materials based on selected order
  const getFilteredMaterials = (orderId: string) => {
    const order = mockPurchaseOrders.find(o => o.id === orderId);
    return order?.materials.map(m => m.materialId) || [];
  };
  
  return (
    <AppLayout requiredRoles={["Almacenista", "Supervisor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Inventario de Materiales</h1>
        
        <Tabs defaultValue="reception">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reception">Recepción de Materiales</TabsTrigger>
            <TabsTrigger value="delivery">Entrega de Materiales</TabsTrigger>
          </TabsList>
          
          {/* Reception Tab */}
          <TabsContent value="reception" className="space-y-6">
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
                    <Input
                      id="reception-quantity"
                      type="number"
                      min="1"
                      value={newReception.quantity}
                      onChange={e => setNewReception({...newReception, quantity: parseInt(e.target.value) || 0})}
                    />
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
                <Button variant="outline" onClick={resetReceptionForm}>
                  Limpiar
                </Button>
                <Button onClick={createReception} className="bg-solenium-blue hover:bg-blue-600">
                  Registrar Recepción
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Recepciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Material</th>
                        <th className="text-left p-2">Cantidad</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Orden</th>
                        <th className="text-left p-2">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receptions.map(reception => (
                        <tr key={reception.id} className="border-b">
                          <td className="p-2">{format(new Date(reception.date), 'dd/MM/yyyy')}</td>
                          <td className="p-2">{reception.materialName}</td>
                          <td className="p-2">{reception.quantity}</td>
                          <td className="p-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              reception.status === "Bueno" ? "bg-green-100 text-green-800" :
                              reception.status === "Regular" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {reception.status}
                            </span>
                          </td>
                          <td className="p-2">#{reception.orderId.substring(0, 5)}</td>
                          <td className="p-2 max-w-xs truncate">{reception.observation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
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
                          // Calculate available quantity
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
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetDeliveryForm}>
                  Limpiar
                </Button>
                <Button onClick={createDelivery} className="bg-solenium-blue hover:bg-blue-600">
                  Registrar Entrega
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Material</th>
                        <th className="text-left p-2">Cantidad</th>
                        <th className="text-left p-2">Entregado a</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map(delivery => (
                        <tr key={delivery.id} className="border-b">
                          <td className="p-2">{format(new Date(delivery.date), 'dd/MM/yyyy')}</td>
                          <td className="p-2">{delivery.materialName}</td>
                          <td className="p-2">{delivery.quantity}</td>
                          <td className="p-2">{delivery.receivedBy}</td>
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

export default Inventory;
