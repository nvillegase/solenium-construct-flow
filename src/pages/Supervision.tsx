
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivities, mockMaterials, mockPurchaseOrders } from "@/lib/mock-data";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { format, differenceInDays, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Mock projects for demonstration
const mockProjects = [
  { 
    id: "project-1", 
    name: "Parque Solar El Carrizo", 
    progress: 65,
    projectedProgress: 75,
    activities: mockActivities,
    materials: mockMaterials,
    purchaseOrders: mockPurchaseOrders
  },
  { 
    id: "project-2", 
    name: "Parque Solar Las Nubes", 
    progress: 40,
    projectedProgress: 50,
    activities: mockActivities.map(a => ({ ...a, id: `${a.id}-p2`, progress: a.progress * 0.8 })),
    materials: mockMaterials.map(m => ({ ...m, id: `${m.id}-p2`, receivedQuantity: m.receivedQuantity * 0.7, usedQuantity: m.usedQuantity * 0.6 })),
    purchaseOrders: mockPurchaseOrders.map(po => ({ ...po, id: `${po.id}-p2` }))
  },
  { 
    id: "project-3", 
    name: "Parque Solar La Montaña", 
    progress: 90,
    projectedProgress: 85,
    activities: mockActivities.map(a => ({ ...a, id: `${a.id}-p3`, progress: Math.min(a.progress * 1.2, 100) })),
    materials: mockMaterials.map(m => ({ ...m, id: `${m.id}-p3`, receivedQuantity: m.receivedQuantity * 0.95, usedQuantity: m.usedQuantity * 0.9 })),
    purchaseOrders: mockPurchaseOrders.map(po => ({ ...po, id: `${po.id}-p3` }))
  }
];

const Supervision = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Prepare projects progress data for comparison
  const projectsProgressData = mockProjects.map(project => ({
    name: project.name,
    real: project.progress,
    proyectado: project.projectedProgress,
    desviacion: project.progress - project.projectedProgress
  }));
  
  // Create time-series data for projects progress (simulated data)
  const timeSeriesData = [
    { date: '01/01', p1Real: 10, p1Proyectado: 15, p2Real: 5, p2Proyectado: 10, p3Real: 20, p3Proyectado: 18 },
    { date: '01/15', p1Real: 20, p1Proyectado: 30, p2Real: 15, p2Proyectado: 20, p3Real: 35, p3Proyectado: 32 },
    { date: '02/01', p1Real: 35, p1Proyectado: 45, p2Real: 22, p2Proyectado: 30, p3Real: 50, p3Proyectado: 48 },
    { date: '02/15', p1Real: 45, p1Proyectado: 55, p2Real: 30, p2Proyectado: 40, p3Real: 65, p3Proyectado: 62 },
    { date: '03/01', p1Real: 55, p1Proyectado: 65, p2Real: 35, p2Proyectado: 45, p3Real: 75, p3Proyectado: 74 },
    { date: '03/15', p1Real: 65, p1Proyectado: 75, p2Real: 40, p2Proyectado: 50, p3Real: 90, p3Proyectado: 85 },
  ];
  
  // Get the current project details if one is selected
  const currentProject = selectedProject 
    ? mockProjects.find(p => p.id === selectedProject)
    : null;
    
  // Prepare activities progress data for the selected project
  const getActivitiesProgressData = (project = mockProjects[0]) => {
    return project.activities.map(activity => ({
      name: activity.name.length > 20 ? activity.name.substring(0, 20) + '...' : activity.name,
      estimado: activity.estimatedQuantity,
      ejecutado: activity.executedQuantity,
      porcentaje: activity.progress,
      // Calculate delay severity (simulated)
      delay: Math.random() > 0.6 ? Math.floor(Math.random() * 10) : 0
    }));
  };
  
  // Prepare materials data for the selected project
  const getMaterialsData = (project = mockProjects[0]) => {
    return project.materials.map(material => ({
      name: material.name.length > 20 ? material.name.substring(0, 20) + '...' : material.name,
      estimado: material.estimatedQuantity,
      recibido: material.receivedQuantity,
      usado: material.usedQuantity,
      enSitio: material.receivedQuantity - material.usedQuantity
    }));
  };
  
  // Calculate delay fill color based on delay value
  const getDelayColor = (delay: number) => {
    if (delay <= 0) return "#4CAF50"; // On time or ahead
    if (delay <= 3) return "#FFC107"; // Slight delay
    if (delay <= 7) return "#FF9800"; // Moderate delay
    return "#FF5252"; // Severe delay
  };
  
  // Prepare delivery performance data
  const getDeliveryPerformanceData = (project = mockProjects[0]) => {
    return project.purchaseOrders
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
  };
  
  return (
    <AppLayout requiredRoles={["Supervisor"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard de Supervisión</h1>
          {selectedProject && (
            <Button 
              variant="outline"
              onClick={() => setSelectedProject(null)}
            >
              ← Volver a Comparativa
            </Button>
          )}
        </div>
        
        {/* Overview of all projects */}
        {!selectedProject ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Comparativa de Avance entre Proyectos</CardTitle>
                <CardDescription>Serie temporal de avance real vs. proyectado para todos los proyectos</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeSeriesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Avance (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="p1Real" name="Carrizo Real" stroke="#2196F3" strokeWidth={2} />
                      <Line type="monotone" dataKey="p1Proyectado" name="Carrizo Proyectado" stroke="#2196F3" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="p2Real" name="Las Nubes Real" stroke="#FF9800" strokeWidth={2} />
                      <Line type="monotone" dataKey="p2Proyectado" name="Las Nubes Proyectado" stroke="#FF9800" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="p3Real" name="La Montaña Real" stroke="#4CAF50" strokeWidth={2} />
                      <Line type="monotone" dataKey="p3Proyectado" name="La Montaña Proyectado" stroke="#4CAF50" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Estado Actual de Proyectos</CardTitle>
                <CardDescription>Comparación entre avance real y proyectado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockProjects.map(project => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Avance Real:</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-solenium-blue" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mb-1">
                            <span>Avance Proyectado:</span>
                            <span className="font-medium">{project.projectedProgress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-400" 
                              style={{ width: `${project.projectedProgress}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mb-1">
                            <span>Desviación:</span>
                            <span className={`font-medium ${project.progress >= project.projectedProgress ? 'text-green-600' : 'text-red-600'}`}>
                              {project.progress >= project.projectedProgress ? '+' : ''}
                              {project.progress - project.projectedProgress}%
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4 bg-solenium-blue hover:bg-blue-600"
                          onClick={() => setSelectedProject(project.id)}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Detailed view of selected project */
          <>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{currentProject?.name} - Detalle</CardTitle>
                  <CardDescription>
                    Avance del proyecto: {currentProject?.progress}% (Proyectado: {currentProject?.projectedProgress}%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="activities">
                    <TabsList className="w-full rounded-none border-b p-0">
                      <TabsTrigger className="rounded-b-none flex-1" value="activities">
                        Actividades
                      </TabsTrigger>
                      <TabsTrigger className="rounded-b-none flex-1" value="materials">
                        Materiales
                      </TabsTrigger>
                      <TabsTrigger className="rounded-b-none flex-1" value="delivery">
                        Entregas
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Activities Tab */}
                    <TabsContent value="activities" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ejecución de Actividades</h3>
                        <p className="text-sm text-gray-500">
                          Las barras muestran el avance real vs. proyectado, con código de colores según la severidad del retraso.
                        </p>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={getActivitiesProgressData(currentProject)}
                              layout="vertical"
                              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={120} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="estimado" fill="#1EAEDB" name="Cantidad Estimada" />
                              <Bar dataKey="ejecutado" fill="#4CAF50" name="Cantidad Ejecutada" />
                              <Bar 
                                dataKey="delay" 
                                fill="#FF5252" 
                                name="Retraso (días)" 
                                label={{ position: 'right', formatter: (value: number) => value > 0 ? `${value}d` : '' }}
                              >
                                {getActivitiesProgressData(currentProject).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={getDelayColor(entry.delay)} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Materials Tab */}
                    <TabsContent value="materials" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Gestión de Materiales</h3>
                        <p className="text-sm text-gray-500">
                          Comparación de cantidades estimadas, recibidas, utilizadas y disponibles en sitio.
                        </p>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getMaterialsData(currentProject)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="estimado" fill="#1EAEDB" name="Estimado" />
                              <Bar dataKey="recibido" fill="#4CAF50" name="Recibido" />
                              <Bar dataKey="usado" fill="#FFA726" name="Utilizado" />
                              <Bar dataKey="enSitio" fill="#9C27B0" name="En Sitio" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Delivery Tab */}
                    <TabsContent value="delivery" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Entregas de Materiales</h3>
                        <p className="text-sm text-gray-500">
                          Análisis de desvíos en los tiempos de entrega de materiales.
                        </p>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getDeliveryPerformanceData(currentProject)}>
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
                              <Bar dataKey="desviación" name="Desvío (días)">
                                {getDeliveryPerformanceData(currentProject).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.desviación > 0 ? "#FF5252" : "#4CAF50"} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Supervision;
