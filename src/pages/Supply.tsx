
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Supply = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const { toast } = useToast();
  
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
          <div className="text-sm text-gray-500">
            Las órdenes de compra se importan automáticamente de sistemas externos
          </div>
        </div>
        
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
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Proyecto:</span>
                              <span className="font-medium">{order.projectName || "No especificado"}</span>
                            </div>
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
