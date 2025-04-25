
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockPurchaseOrders, mockMaterials } from "@/lib/mock-data";
import { PurchaseOrder } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Supply = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const { toast } = useToast();
  
  // New order form state
  const [newOrder, setNewOrder] = useState<{
    supplier: string,
    estimatedDeliveryDate: string,
    materials: Array<{ id: string, materialId: string, materialName: string, quantity: number }>
  }>({
    supplier: "",
    estimatedDeliveryDate: "",
    materials: []
  });
  
  // Add a new material to the order
  const addMaterialToOrder = () => {
    if (newOrder.materials.length >= mockMaterials.length) {
      toast({
        title: "No hay más materiales disponibles",
        description: "Ya has añadido todos los materiales a la orden",
        variant: "destructive"
      });
      return;
    }
    
    // Find a material not yet added
    const availableMaterials = mockMaterials.filter(
      material => !newOrder.materials.some(m => m.materialId === material.id)
    );
    
    if (availableMaterials.length > 0) {
      const firstAvailable = availableMaterials[0];
      setNewOrder({
        ...newOrder,
        materials: [
          ...newOrder.materials,
          {
            id: `new-${Date.now()}-${firstAvailable.id}`,
            materialId: firstAvailable.id,
            materialName: firstAvailable.name,
            quantity: 0
          }
        ]
      });
    }
  };
  
  // Remove a material from the order
  const removeMaterialFromOrder = (id: string) => {
    setNewOrder({
      ...newOrder,
      materials: newOrder.materials.filter(material => material.id !== id)
    });
  };
  
  // Update material in the order
  const updateMaterialInOrder = (id: string, field: 'materialId' | 'quantity', value: string | number) => {
    setNewOrder({
      ...newOrder,
      materials: newOrder.materials.map(material => {
        if (material.id === id) {
          if (field === 'materialId') {
            const selectedMaterial = mockMaterials.find(m => m.id === value);
            return {
              ...material,
              materialId: value as string,
              materialName: selectedMaterial?.name || ""
            };
          }
          return { ...material, [field]: value };
        }
        return material;
      })
    });
  };
  
  // Create new purchase order
  const createPurchaseOrder = () => {
    // Validation
    if (!newOrder.supplier.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un proveedor",
        variant: "destructive"
      });
      return;
    }
    
    if (!newOrder.estimatedDeliveryDate) {
      toast({
        title: "Error",
        description: "Debe seleccionar una fecha estimada de entrega",
        variant: "destructive"
      });
      return;
    }
    
    if (newOrder.materials.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un material",
        variant: "destructive"
      });
      return;
    }
    
    if (newOrder.materials.some(m => m.quantity <= 0)) {
      toast({
        title: "Error",
        description: "Todas las cantidades deben ser mayores a cero",
        variant: "destructive"
      });
      return;
    }
    
    // Create new order
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      materials: newOrder.materials,
      supplier: newOrder.supplier,
      estimatedDeliveryDate: newOrder.estimatedDeliveryDate,
      status: "Pendiente",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPurchaseOrders([newPO, ...purchaseOrders]);
    
    toast({
      title: "Orden creada",
      description: `Orden de compra creada para ${newOrder.supplier}`
    });
    
    // Reset form
    setNewOrder({
      supplier: "",
      estimatedDeliveryDate: "",
      materials: []
    });
    setShowNewOrderForm(false);
  };
  
  // Get badge color based on order status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "En Tránsito": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Recibido Parcial": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Recibido Total": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "";
    }
  };
  
  return (
    <AppLayout requiredRoles={["Suministro", "Supervisor"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Suministro de Materiales</h1>
          <Button 
            onClick={() => setShowNewOrderForm(!showNewOrderForm)} 
            className={`${showNewOrderForm ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-solenium-blue hover:bg-blue-600"}`}
          >
            {showNewOrderForm ? "Cancelar" : "Nueva Orden de Compra"}
          </Button>
        </div>
        
        {showNewOrderForm && (
          <Card className="border-2 border-solenium-blue border-opacity-50">
            <CardHeader>
              <CardTitle>Nueva Orden de Compra</CardTitle>
              <CardDescription>Complete los datos para crear una nueva orden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input
                    id="supplier"
                    value={newOrder.supplier}
                    onChange={e => setNewOrder({...newOrder, supplier: e.target.value})}
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDate">Fecha Est. Entrega</Label>
                  <Input
                    id="estimatedDeliveryDate"
                    type="date"
                    value={newOrder.estimatedDeliveryDate}
                    onChange={e => setNewOrder({...newOrder, estimatedDeliveryDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Materiales</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addMaterialToOrder}
                    className="h-8"
                  >
                    <Plus size={16} className="mr-1" /> Agregar material
                  </Button>
                </div>
                
                {newOrder.materials.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No hay materiales agregados. Haga clic en "Agregar material"
                  </p>
                ) : (
                  <div className="space-y-4">
                    {newOrder.materials.map((material, index) => (
                      <div key={material.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                        <div className="flex-1">
                          <Select
                            value={material.materialId}
                            onValueChange={(value) => updateMaterialInOrder(material.id, 'materialId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione material" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockMaterials.map(mat => (
                                <SelectItem 
                                  key={mat.id} 
                                  value={mat.id}
                                  disabled={newOrder.materials.some(
                                    m => m.id !== material.id && m.materialId === mat.id
                                  )}
                                >
                                  {mat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            value={material.quantity}
                            onChange={e => updateMaterialInOrder(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                            min="1"
                            placeholder="Cantidad"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMaterialFromOrder(material.id)}
                          className="h-8 w-8 text-red-500 flex-shrink-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewOrderForm(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={createPurchaseOrder}
                className="bg-solenium-blue hover:bg-blue-600"
              >
                Crear Orden
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="transit">En Tránsito</TabsTrigger>
            <TabsTrigger value="partial">Recibido Parcial</TabsTrigger>
            <TabsTrigger value="complete">Recibido Total</TabsTrigger>
          </TabsList>
          
          {["all", "pending", "transit", "partial", "complete"].map(tabValue => {
            const statusFilter = {
              all: () => true,
              pending: (po: PurchaseOrder) => po.status === "Pendiente",
              transit: (po: PurchaseOrder) => po.status === "En Tránsito",
              partial: (po: PurchaseOrder) => po.status === "Recibido Parcial",
              complete: (po: PurchaseOrder) => po.status === "Recibido Total",
            };
            
            const filteredOrders = purchaseOrders.filter(statusFilter[tabValue as keyof typeof statusFilter]);
            
            return (
              <TabsContent key={tabValue} value={tabValue}>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No hay órdenes de compra en esta categoría</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map(order => (
                      <Card key={order.id} className="material-card">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {order.supplier}
                              </CardTitle>
                              <CardDescription>
                                Orden #{order.id.substring(3, 8)} • Creada el {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Entrega estimada:</span>
                              <span className="font-medium">{format(new Date(order.estimatedDeliveryDate), 'dd/MM/yyyy')}</span>
                            </div>
                            {order.actualDeliveryDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Entrega real:</span>
                                <span className="font-medium">{format(new Date(order.actualDeliveryDate), 'dd/MM/yyyy')}</span>
                              </div>
                            )}
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Materiales:</p>
                            <ul className="space-y-1 text-sm">
                              {order.materials.map(material => (
                                <li key={material.id} className="flex justify-between">
                                  <span>{material.materialName}</span>
                                  <span className="font-medium">{material.quantity} unidades</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Supply;
