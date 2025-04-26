
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockPurchaseOrders, mockProjects } from "@/lib/mock-data";
import { PurchaseOrder } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const Supply = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedProjectId, setSelectedProjectId] = useState<string | "all">("all");
  const { user } = useAuth();
  
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
  
  // Filter orders by selected project
  const filterOrdersByProject = (orders: PurchaseOrder[], projectId: string | "all") => {
    if (projectId === "all") return orders;
    
    // Check if the order is related to the selected project
    return orders.filter(order => {
      // Check if project is in projectIds array
      if (order.projectIds.includes(projectId)) return true;
      
      // Check individual materials if they have projectId
      const hasMaterialForProject = order.materials.some(mat => 
        'projectId' in mat && mat.projectId === projectId
      );
      
      return hasMaterialForProject;
    });
  };
  
  const filteredOrders = filterOrdersByProject(purchaseOrders, selectedProjectId);
  
  return (
    <AppLayout requiredRoles={["Suministro", "Supervisor", "Residente"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Suministro de Materiales</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="text-sm text-gray-500">
              Las órdenes de compra se importan automáticamente de sistemas externos
            </div>
            
            {/* Project filter */}
            <div className="w-full sm:w-auto min-w-[220px]">
              <Select
                value={selectedProjectId}
                onValueChange={(value) => setSelectedProjectId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proyectos</SelectItem>
                  {mockProjects.filter(project => 
                    user?.projectIds?.includes(project.id) || user?.role === "Supervisor"
                  ).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            
            const ordersForTab = filteredOrders.filter(statusFilter[tabValue as keyof typeof statusFilter]);
            
            return (
              <TabsContent key={tabValue} value={tabValue}>
                {ordersForTab.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No hay órdenes de compra en esta categoría</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordersForTab.map(order => (
                      <Card key={order.id} className="material-card">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {order.supplier}
                              </CardTitle>
                              <CardDescription>
                                Orden #{order.id.substring(0, 5)} • Creada el {format(new Date(order.createdAt), 'dd/MM/yyyy')}
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
                              <span className="text-gray-500">Proyecto principal:</span>
                              <span className="font-medium">
                                {order.projectNames ? order.projectNames[0] : 
                                 (order.projectIds?.length > 0 ? 
                                  mockProjects.find(p => p.id === order.projectIds[0])?.name || "No especificado" 
                                  : "No especificado")}
                              </span>
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Materiales:</p>
                            <ul className="space-y-1 text-sm">
                              {order.materials.map(material => (
                                <li key={material.id} className="flex justify-between">
                                  <div className="flex-1">
                                    <span>{material.materialName}</span>
                                    {'projectId' in material && material.projectId !== order.projectIds[0] && (
                                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        {mockProjects.find(p => p.id === material.projectId)?.name || 'Otro proyecto'}
                                      </span>
                                    )}
                                  </div>
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
