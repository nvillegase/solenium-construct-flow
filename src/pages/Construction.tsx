
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockActivities, mockDailyExecutions, mockDailyProjections } from "@/lib/mock-data";
import { Activity, DailyExecution, IssueCategory, DailyProjection } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Plus, Save, Trash2 } from "lucide-react";

const CONTRACTORS = ["CONSTRUYENDO", "ELECTROMONTES", "OSPINAS", "ELÉCTRICOS DEL CESAR"];

const Construction = () => {
  // State for daily projection
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectedActivities, setProjectedActivities] = useState<DailyProjection["activities"]>([]);
  const [currentActivity, setCurrentActivity] = useState({
    activityId: "",
    contractor: "",
    quantity: 0,
    unit: ""
  });

  // State for execution
  const [selectedExecutionDate, setSelectedExecutionDate] = useState<string | null>(null);
  const [executions, setExecutions] = useState<DailyExecution[]>(mockDailyExecutions);
  const { toast } = useToast();

  // Handle adding a new activity to the daily projection
  const addActivityToProjection = () => {
    if (!currentActivity.activityId || !currentActivity.contractor || currentActivity.quantity <= 0) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive"
      });
      return;
    }

    setProjectedActivities([...projectedActivities, currentActivity]);
    setCurrentActivity({
      activityId: "",
      contractor: "",
      quantity: 0,
      unit: ""
    });
  };

  // Handle scheduling the day's activities
  const scheduleDay = () => {
    if (projectedActivities.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos una actividad",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be an API call
    const newProjection: DailyProjection = {
      id: `proj-${Date.now()}`,
      projectId: "project-1", // This would come from the project context
      date: selectedDate,
      activities: projectedActivities,
      isExecutionComplete: false
    };

    toast({
      title: "Éxito",
      description: "Actividades programadas correctamente"
    });

    // Reset form
    setProjectedActivities([]);
  };

  // Get projections for a specific date
  const getProjectionsForDate = (date: string) => {
    return mockDailyProjections.find(p => p.date === date);
  };

  // Get all dates with projections
  const getDatesWithProjections = () => {
    return [...new Set(mockDailyProjections.map(p => p.date))].sort();
  };

  return (
    <AppLayout requiredRoles={["Residente", "Supervisor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Gestión de Obra</h1>

        <Tabs defaultValue="planning">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planning">Proyección de Actividades</TabsTrigger>
            <TabsTrigger value="execution">Ejecución Diaria</TabsTrigger>
          </TabsList>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Proyección para el día
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form to add activities */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Actividad</Label>
                    <Select
                      value={currentActivity.activityId}
                      onValueChange={(value) => {
                        const activity = mockActivities.find(a => a.id === value);
                        setCurrentActivity({
                          ...currentActivity,
                          activityId: value,
                          unit: activity?.unit || ""
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockActivities.map(activity => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contratista</Label>
                    <Select
                      value={currentActivity.contractor}
                      onValueChange={(value) => setCurrentActivity({...currentActivity, contractor: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar contratista" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTRACTORS.map(contractor => (
                          <SelectItem key={contractor} value={contractor}>
                            {contractor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="0"
                      value={currentActivity.quantity || ""}
                      onChange={(e) => setCurrentActivity({
                        ...currentActivity,
                        quantity: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={addActivityToProjection}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Actividad
                    </Button>
                  </div>
                </div>

                {/* List of added activities */}
                {projectedActivities.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">Actividades a programar:</h3>
                    <div className="space-y-2">
                      {projectedActivities.map((activity, index) => {
                        const activityDetails = mockActivities.find(a => a.id === activity.activityId);
                        return (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium">{activityDetails?.name}</span>
                              <span className="text-gray-500 ml-2">
                                ({activity.quantity} {activity.unit} - {activity.contractor})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newActivities = [...projectedActivities];
                                newActivities.splice(index, 1);
                                setProjectedActivities(newActivities);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setProjectedActivities([])}
                >
                  Limpiar
                </Button>
                <Button 
                  onClick={scheduleDay}
                  disabled={projectedActivities.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Programar Día
                </Button>
              </CardFooter>
            </Card>

            {/* Show scheduled activities by date */}
            <Card>
              <CardHeader>
                <CardTitle>Programación por Fecha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDatesWithProjections().map(date => {
                    const projection = getProjectionsForDate(date);
                    return (
                      <div key={date} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">
                            {format(new Date(date), 'dd/MM/yyyy')}
                          </h3>
                          {!projection?.isExecutionComplete && (
                            <Alert className="bg-yellow-50 text-yellow-800 p-2">
                              <Info className="w-4 h-4" />
                              <AlertDescription>
                                Pendiente reporte de ejecución
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <div className="space-y-2">
                          {projection?.activities.map((activity, index) => {
                            const activityDetails = mockActivities.find(a => a.id === activity.activityId);
                            return (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span>
                                  <span className="font-medium">{activityDetails?.name}</span>
                                  <span className="text-gray-500 ml-2">
                                    ({activity.quantity} {activity.unit} - {activity.contractor})
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Ejecución Diaria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Date selector for execution */}
                  <div className="space-y-2">
                    <Label>Fecha de Ejecución</Label>
                    <Select
                      value={selectedExecutionDate || ""}
                      onValueChange={setSelectedExecutionDate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDatesWithProjections().map(date => {
                          const projection = getProjectionsForDate(date);
                          return (
                            <SelectItem key={date} value={date}>
                              {format(new Date(date), 'dd/MM/yyyy')}
                              {!projection?.isExecutionComplete && " (Pendiente)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show activities for selected date */}
                  {selectedExecutionDate && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Actividades Programadas:</h3>
                      {getProjectionsForDate(selectedExecutionDate)?.activities.map((activity, index) => {
                        const activityDetails = mockActivities.find(a => a.id === activity.activityId);
                        return (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">{activityDetails?.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    Contratista: {activity.contractor}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Cantidad Programada: {activity.quantity} {activity.unit}
                                  </p>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Cantidad Ejecutada</Label>
                                    <Input type="number" min="0" />
                                  </div>
                                  <div>
                                    <Label>Observaciones</Label>
                                    <Textarea rows={2} />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      <div className="flex justify-end">
                        <Button>
                          Guardar Reporte de Ejecución
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Construction;
