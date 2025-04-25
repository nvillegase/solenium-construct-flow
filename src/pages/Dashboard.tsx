
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockActivities, mockMaterials, mockPurchaseOrders } from "@/lib/mock-data";
import { UserRole } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const getWelcomeMessage = (role: UserRole): string => {
  switch (role) {
    case "Diseñador":
      return "Gestiona las cantidades de obra y materiales estimados para el proyecto.";
    case "Suministro":
      return "Administra las órdenes de compra y el seguimiento de proveedores.";
    case "Almacenista":
      return "Controla la recepción y entrega de materiales en el proyecto.";
    case "Residente":
      return "Supervisa la ejecución de actividades diarias en la obra.";
    case "Supervisor":
      return "Monitorea el avance general del proyecto y sus indicadores clave.";
    default:
      return "Bienvenido al sistema de gestión de proyectos solares.";
  }
};

// Calculate overall project progress
const calculateOverallProgress = (): number => {
  const totalEstimated = mockActivities.reduce((sum, act) => sum + act.estimatedQuantity, 0);
  const totalExecuted = mockActivities.reduce((sum, act) => sum + act.executedQuantity, 0);
  return Math.round((totalExecuted / totalEstimated) * 100);
};

// Prepare chart data
const prepareChartData = () => {
  return mockActivities.map(activity => ({
    name: activity.name.length > 15 ? activity.name.substring(0, 15) + '...' : activity.name,
    estimado: activity.estimatedQuantity,
    ejecutado: activity.executedQuantity
  }));
};

// Materials status data
const prepareMaterialsData = () => {
  return mockMaterials.map(material => ({
    name: material.name.length > 15 ? material.name.substring(0, 15) + '...' : material.name,
    estimado: material.estimatedQuantity,
    recibido: material.receivedQuantity,
    usado: material.usedQuantity
  }));
};

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || "Usuario";
  const welcomeMessage = getWelcomeMessage(role as UserRole);
  const overallProgress = calculateOverallProgress();
  const activityChartData = prepareChartData();
  const materialsChartData = prepareMaterialsData();
  
  // Count orders by status
  const orderStatusCounts = {
    pending: mockPurchaseOrders.filter(o => o.status === "Pendiente").length,
    inTransit: mockPurchaseOrders.filter(o => o.status === "En Tránsito").length,
    partiallyReceived: mockPurchaseOrders.filter(o => o.status === "Recibido Parcial").length,
    fullyReceived: mockPurchaseOrders.filter(o => o.status === "Recibido Total").length
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Bienvenido, {user?.name}</h1>
          <p className="text-gray-600">{welcomeMessage}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Project Progress Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avance Total del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          {/* Order Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Estado de Órdenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs">Pendientes</span>
                <span className="text-xs font-bold">{orderStatusCounts.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">En Tránsito</span>
                <span className="text-xs font-bold">{orderStatusCounts.inTransit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Recibido Parcial</span>
                <span className="text-xs font-bold">{orderStatusCounts.partiallyReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Recibido Total</span>
                <span className="text-xs font-bold">{orderStatusCounts.fullyReceived}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Materials Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Materiales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs">Total Estimado</span>
                <span className="text-xs font-bold">{mockMaterials.length} tipos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Recibidos</span>
                <span className="text-xs font-bold">
                  {mockMaterials.filter(m => m.receivedQuantity > 0).length} tipos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Utilizados</span>
                <span className="text-xs font-bold">
                  {mockMaterials.filter(m => m.usedQuantity > 0).length} tipos
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Activities Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Actividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs">Total Actividades</span>
                <span className="text-xs font-bold">{mockActivities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">En Progreso</span>
                <span className="text-xs font-bold">
                  {mockActivities.filter(a => a.progress > 0 && a.progress < 100).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Completadas</span>
                <span className="text-xs font-bold">
                  {mockActivities.filter(a => a.progress === 100).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activities Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Avance de Actividades</CardTitle>
              <CardDescription>Comparación entre cantidades estimadas y ejecutadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="estimado" fill="#1EAEDB" name="Estimado" />
                    <Bar dataKey="ejecutado" fill="#4CAF50" name="Ejecutado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Materials Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Materiales</CardTitle>
              <CardDescription>Comparación entre materiales estimados, recibidos y utilizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="estimado" fill="#1EAEDB" name="Estimado" />
                    <Bar dataKey="recibido" fill="#4CAF50" name="Recibido" />
                    <Bar dataKey="usado" fill="#FFC107" name="Utilizado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
