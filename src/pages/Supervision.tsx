
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivities, mockMaterials, mockPurchaseOrders } from "@/lib/mock-data";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { format, differenceInDays, parseISO } from "date-fns";

const Supervision = () => {
  // Prepare activities progress data
  const activitiesProgressData = mockActivities.map(activity => ({
    name: activity.name.length > 20 ? activity.name.substring(0, 20) + '...' : activity.name,
    estimado: activity.estimatedQuantity,
    ejecutado: activity.executedQuantity,
    porcentaje: activity.progress
  }));
  
  // Prepare materials data
  const materialsData = mockMaterials.map(material => ({
    name: material.name.length > 20 ? material.name.substring(0, 20) + '...' : material.name,
    estimado: material.estimatedQuantity,
    recibido: material.receivedQuantity,
    usado: material.usedQuantity
  }));
  
  // Calculate overall project progress
  const calculateOverallProgress = () => {
    const totalEstimated = mockActivities.reduce((sum, act) => sum + act.estimatedQuantity, 0);
    const totalExecuted = mockActivities.reduce((sum, act) => sum + act.executedQuantity, 0);
    return {
      executed: totalExecuted,
      total: totalEstimated,
      percentage: Math.round((totalExecuted / totalEstimated) * 100)
    };
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Prepare progress distribution data for pie chart
  const progressDistributionData = [
    { name: "Completado", value: overallProgress.executed },
    { name: "Pendiente", value: overallProgress.total - overallProgress.executed }
  ];
  
  const COLORS = ["#4CAF50", "#F1F1F1"];
  
  // Prepare delivery performance data
  const deliveryPerformanceData = mockPurchaseOrders
    .filter(order => order.actualDeliveryDate)
    .map(order => {
      const estimatedDate = parseISO(order.estimatedDeliveryDate);
      const actualDate = parseISO(order.actualDeliveryDate!);
      const delay = differenceInDays(actualDate, estimatedDate);
      
      return {
        name: order.supplier.length > 15 ? order.supplier.substring(0, 15) + '...' : order.supplier,
        estimado: format(estimatedDate, 'dd/MM'),
        real: format(actualDate, 'dd/MM'),
        desviación: delay
      };
    });
  
  // Prepare activity scatter data
  const activityScatterData = mockActivities.map(activity => ({
    name: activity.name,
    progress: activity.progress,
    estimado: activity.estimatedQuantity,
    ejecutado: activity.executedQuantity,
    size: Math.max(10, Math.min(activity.estimatedQuantity / 10, 30))
  }));
  
  return (
    <AppLayout requiredRoles={["Supervisor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard de Supervisión</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Avance General del Proyecto</CardTitle>
              <CardDescription>Porcentaje completado vs pendiente</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {progressDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} unidades`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <p className="text-3xl font-bold">{overallProgress.percentage}%</p>
                <p className="text-sm text-gray-500">Avance Total del Proyecto</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Desvío en Fechas de Entrega</CardTitle>
              <CardDescription>Fechas estimadas vs fechas reales de entrega</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'desviación') return [`${value} días`, 'Desviación'];
                        return [value, name === 'estimado' ? 'Fecha estimada' : 'Fecha real'];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="desviación" fill={deliveryPerformanceData.some(d => d.desviación > 0) ? "#FF5252" : "#4CAF50"} name="Desvío (días)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Avance de Actividades</CardTitle>
              <CardDescription>Comparación entre cantidades estimadas y ejecutadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={activitiesProgressData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="estimado" fill="#1EAEDB" name="Cantidad Estimada" />
                    <Bar dataKey="ejecutado" fill="#4CAF50" name="Cantidad Ejecutada" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Materiales</CardTitle>
              <CardDescription>Estado de materiales estimados, recibidos y utilizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="estimado" fill="#1EAEDB" name="Estimado" />
                    <Bar dataKey="recibido" fill="#4CAF50" name="Recibido" />
                    <Bar dataKey="usado" fill="#FFA726" name="Utilizado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Avance vs. Tamaño de Actividad</CardTitle>
              <CardDescription>Visualización de avance y cantidad por actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="progress" 
                      name="Avance (%)" 
                      domain={[0, 100]}
                      label={{ value: 'Avance (%)', position: 'bottom', offset: 0 }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="estimado" 
                      name="Cantidad Estimada"
                      label={{ value: 'Cantidad Estimada', angle: -90, position: 'left' }} 
                    />
                    <ZAxis
                      type="number"
                      dataKey="size"
                      range={[50, 400]}
                      name="Tamaño"
                    />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (name === 'Avance (%)') return [`${value}%`, name];
                        return [value, name];
                      }}
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border shadow-md rounded-md">
                              <p className="font-medium text-xs">{data.name}</p>
                              <p className="text-xs">Avance: {data.progress}%</p>
                              <p className="text-xs">Estimado: {data.estimado}</p>
                              <p className="text-xs">Ejecutado: {data.ejecutado}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Actividades" data={activityScatterData} fill="#1EAEDB" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Supervision;
