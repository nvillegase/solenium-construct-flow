
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";
import MaterialShipmentProgress from "@/components/MaterialsShipmentProgress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  activitiesData: any[];
  materialsData: any[];
  deliveryData: any[];
  actividadesEjemplo: any[];
}

export const ProjectDetails: FC<ProjectDetailsProps> = ({ 
  project, 
  onBack,
  activitiesData,
  materialsData,
  deliveryData,
  actividadesEjemplo
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Supervisión</h1>
        <Button 
          variant="outline"
          onClick={onBack}
        >
          ← Volver a Comparativa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{project.name} - Detalle</CardTitle>
          <CardDescription>
            Avance del proyecto: {project.progress}% (Proyectado: {project.projectedProgress}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Ejecución de Actividades</h3>
              <p className="text-sm text-gray-500 mb-2">
                Porcentaje de avance y días de retraso por actividad
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={activitiesData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar 
                      dataKey="porcentaje" 
                      name="% Avance" 
                      fill="#4CAF50"
                    >
                      {activitiesData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.delay <= 0 ? "#4CAF50" : 
                                entry.delay <= 3 ? "#FFC107" :
                                entry.delay <= 7 ? "#FF9800" : "#FF5252"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Disponibilidad de Materiales</h3>
              <p className="text-sm text-gray-500 mb-2">
                Distribución de materiales por estado
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={materialsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="recibido" name="Recibido" fill="#2196F3" />
                    <Bar dataKey="usado" name="Usado" fill="#FF9800" />
                    <Bar dataKey="enSitio" name="En Sitio" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Entregas de Materiales</h3>
              <p className="text-sm text-gray-500">
                Análisis de desvíos en los tiempos de entrega de materiales.
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryData}>
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
                      {deliveryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.desviación > 0 ? "#FF5252" : "#4CAF50"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Recepción de materiales</h3>
              <p className="text-sm text-gray-500 mb-2">
                Porcentaje de materiales entregados por actividad.
              </p>
              <div className="h-80 overflow-y-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <MaterialShipmentProgress activities={actividadesEjemplo} />
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

