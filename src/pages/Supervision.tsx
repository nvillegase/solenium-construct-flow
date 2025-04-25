
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivities, mockMaterials, mockPurchaseOrders, mockDailyExecutions, mockProjects } from "@/lib/mock-data";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { format, differenceInDays, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IssueCategory } from "@/lib/types";

// Colors for charts
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
  "#82CA9D", "#FFC658", "#FF6B6B", "#6A7FDB", "#61DAFB"
];

const Supervision = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Prepare projects progress data for comparison
  const projectsProgressData = mockProjects.map(project => ({
    name: project.name,
    real: project.progress,
    proyectado: project.projectedProgress || project.progress + 10,
    desviacion: project.progress - (project.projectedProgress || project.progress + 10)
  }));
  
  // Create time-series data for projects progress (simulated data)
  const timeSeriesData = [
    { date: '01/01', p1Real: 10, p1Proyectado: 15, p2Real: 5, p2Proyectado: 10, p3Real: 20, p3Proyectado: 18, p4Real: 30, p4Proyectado: 28 },
    { date: '01/15', p1Real: 20, p1Proyectado: 30, p2Real: 15, p2Proyectado: 20, p3Real: 35, p3Proyectado: 32, p4Real: 40, p4Proyectado: 42 },
    { date: '02/01', p1Real: 35, p1Proyectado: 45, p2Real: 22, p2Proyectado: 30, p3Real: 50, p3Proyectado: 48, p4Real: 50, p4Proyectado: 55 },
    { date: '02/15', p1Real: 45, p1Proyectado: 55, p2Real: 30, p2Proyectado: 40, p3Real: 65, p3Proyectado: 62, p4Real: 60, p4Proyectado: 68 },
    { date: '03/01', p1Real: 55, p1Proyectado: 65, p2Real: 35, p2Proyectado: 45, p3Real: 75, p3Proyectado: 74, p4Real: 70, p4Proyectado: 78 },
    { date: '03/15', p1Real: 65, p1Proyectado: 75, p2Real: 40, p2Proyectado: 50, p3Real: 85, p3Proyectado: 88, p4Real: 85, p4Proyectado: 88 },
  ];
  
  // Get the current project details if one is selected
  const currentProject = selectedProject 
    ? mockProjects.find(p => p.id === selectedProject)
    : null;

  // Process issue categories data for all projects
  const processIssueCategoriesData = (projectId?: string) => {
    const filteredExecutions = projectId 
      ? mockDailyExecutions.filter(item => item.projectId === projectId && item.issueCategory)
      : mockDailyExecutions.filter(item => item.issueCategory);
    
    // Count occurrences of each issue category
    const categoryCounts: Record<string, number> = {};
    
    filteredExecutions.forEach(execution => {
      if (execution.issueCategory) {
        categoryCounts[execution.issueCategory] = (categoryCounts[execution.issueCategory] || 0) + 1;
      }
    });
    
    // Convert to array format for recharts
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Prepare activities progress data for the selected project
  const getActivitiesProgressData = (project = mockProjects[0]) => {
    // Filter activities for current project
    const projectActivities = mockActivities.filter(activity => activity.projectId === project.id);
    
    return projectActivities.map(activity => ({
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
    // Filter materials for current project
    const projectMaterials = mockMaterials.filter(material => material.projectId === project.id);
    
    return projectMaterials.map(material => ({
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
  
  const allProjectsIssueData = processIssueCategoriesData();
  const currentProjectIssueData = currentProject ? processIssueCategoriesData(currentProject.id) : [];
  
  return (
    <AppLayout requiredRoles={["Supervisor"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Supervisión</h1>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <Line type="monotone" dataKey="p1Real" name="Vallenata Real" stroke="#2196F3" strokeWidth={2} />
                        <Line type="monotone" dataKey="p1Proyectado" name="Vallenata Proyectado" stroke="#2196F3" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="p2Real" name="El Son Real" stroke="#FF9800" strokeWidth={2} />
                        <Line type="monotone" dataKey="p2Proyectado" name="El Son Proyectado" stroke="#FF9800" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="p3Real" name="Puya Real" stroke="#4CAF50" strokeWidth={2} />
                        <Line type="monotone" dataKey="p3Proyectado" name="Puya Proyectado" stroke="#4CAF50" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="p4Real" name="Mapalé Real" stroke="#9C27B0" strokeWidth={2} />
                        <Line type="monotone" dataKey="p4Proyectado" name="Mapalé Proyectado" stroke="#9C27B0" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Distribución de Categorías de Novedad</CardTitle>
                  <CardDescription>Ocurrencias por tipo de novedad en todos los proyectos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allProjectsIssueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {allProjectsIssueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} ocurrencias`, 'Cantidad']} />
                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Estado Actual de Proyectos</CardTitle>
                <CardDescription>Comparación entre avance real y proyectado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <span className="font-medium">{project.projectedProgress || project.progress + 10}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-400" 
                              style={{ width: `${project.projectedProgress || project.progress + 10}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mb-1">
                            <span>Desviación:</span>
                            <span className={`font-medium ${project.progress >= (project.projectedProgress || project.progress + 10) ? 'text-green-600' : 'text-red-600'}`}>
                              {project.progress >= (project.projectedProgress || project.progress + 10) ? '+' : ''}
                              {project.progress - (project.projectedProgress || project.progress + 10)}%
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
                    Avance del proyecto: {currentProject?.progress}% (Proyectado: {currentProject?.projectedProgress || currentProject?.progress + 10}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Activities Progress */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Ejecución de Actividades</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Avance real vs. proyectado con código de colores según retraso
                      </p>
                      <div className="h-80 border rounded-md p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={getActivitiesProgressData(currentProject)}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} />
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
                    
                    {/* Materials Management */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Gestión de Materiales</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Cantidades estimadas, recibidas, utilizadas y disponibles
                      </p>
                      <div className="h-80 border rounded-md p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={getMaterialsData(currentProject)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
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
                    
                    {/* Issue Categories Distribution */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Novedades Reportadas</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Distribución por categoría de novedad
                      </p>
                      <div className="h-80 border rounded-md p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={currentProjectIssueData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name.length > 15 ? name.substring(0, 15) + '...' : name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {currentProjectIssueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} ocurrencias`, 'Cantidad']} />
                            <Legend layout="vertical" verticalAlign="bottom" align="center" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {currentProjectIssueData.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                          No hay novedades reportadas para este proyecto
                        </div>
                      )}
                    </div>
                  </div>
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
