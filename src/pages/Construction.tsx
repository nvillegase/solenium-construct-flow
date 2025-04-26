
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockActivities, mockDailyExecutions, mockDailyProjections, mockProjects } from "@/lib/mock-data";
import { Activity, DailyExecution, IssueCategory, DailyProjection } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Plus, Save, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CONTRACTORS = ["CONSTRUYENDO", "ELECTROMONTES", "OSPINAS", "ELÉCTRICOS DEL CESAR"];
const ISSUE_CATEGORIES: IssueCategory[] = [
  'Lluvia moderada',
  'Tormenta',
  'Falta de suministro',
  'Vandalismo',
  'Delincuencia organizada',
  'Paros o manifestaciones en las vías',
  'Falta de especificaciones técnicas en los diseños',
  'RTB incompleto',
  'Daño de maquinaria o herramienta',
  'Sin novedad',
  'Programación hincadora',
  'Otros'
];

const Construction = () => {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const availableProjects = mockProjects.filter(project => 
    user?.projectIds?.includes(project.id) || user?.role === "Supervisor"
  );

  // Initialize selected project from user's first project (if available)
  useState(() => {
    if (availableProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(availableProjects[0].id);
    }
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectedActivities, setProjectedActivities] = useState<DailyProjection["activities"]>([]);
  const [currentActivity, setCurrentActivity] = useState({
    activityId: "",
    contractorId: "", // Changed from contractor to contractorId for type consistency
    quantity: 0,
    unit: ""
  });

  const [selectedExecutionDate, setSelectedExecutionDate] = useState<string | null>(null);
  const [executions, setExecutions] = useState<DailyExecution[]>(mockDailyExecutions);
  const [editingProjection, setEditingProjection] = useState<string | null>(null);
  const [executionData, setExecutionData] = useState<{
    [key: string]: {
      quantity: number;
      notes: string;
      issueCategory?: IssueCategory;
      issueNotes?: string;
    };
  }>({});
  const { toast } = useToast();

  const addActivityToProjection = () => {
    if (!currentActivity.activityId || !currentActivity.contractorId || currentActivity.quantity <= 0) {
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
      contractorId: "",
      quantity: 0,
      unit: ""
    });
  };

  const scheduleDay = () => {
    if (projectedActivities.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos una actividad",
        variant: "destructive"
      });
      return;
    }

    const newProjection: DailyProjection = {
      id: `proj-${Date.now()}`,
      projectId: selectedProjectId || "project-1",
      date: selectedDate,
      activities: projectedActivities,
      isExecutionComplete: false
    };

    toast({
      title: "Éxito",
      description: "Actividades programadas correctamente"
    });

    setProjectedActivities([]);
  };

  const getProjectionsForDate = (date: string) => {
    return mockDailyProjections.find(p => p.date === date);
  };

  const getDatesWithProjections = () => {
    return [...new Set(mockDailyProjections.map(p => p.date))].sort();
  };

  const handleUpdateProjection = (projectionId: string, activities: DailyProjection['activities']) => {
    toast({
      title: "Éxito",
      description: "Programación actualizada correctamente"
    });
    setEditingProjection(null);
  };

  const handleExecutionSubmit = (date: string) => {
    if (Object.keys(executionData).length === 0) {
      toast({
        title: "Error",
        description: "Debe ingresar al menos un registro de ejecución",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Reporte de ejecución guardado correctamente"
    });

    setExecutionData({});
  };

  return (
    <AppLayout requiredRoles={["Residente", "Supervisor"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gestión de Obra</h1>
          
          <div className="w-[200px]">
            <Select
              value={selectedProjectId || ""}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proyecto" />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProjectId ? (
          <Tabs defaultValue="planning">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="planning">Proyección de Actividades</TabsTrigger>
              <TabsTrigger value="execution">Ejecución Diaria</TabsTrigger>
            </TabsList>

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
                        value={currentActivity.contractorId}
                        onValueChange={(value) => setCurrentActivity({...currentActivity, contractorId: value})}
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
                                  ({activity.quantity} {activity.unit} - {activity.contractorId})
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

              <Card>
                <CardHeader>
                  <CardTitle>Programación por Fecha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getDatesWithProjections().map(date => {
                      const projection = getProjectionsForDate(date);
                      const isEditing = editingProjection === projection?.id;

                      return (
                        <div key={date} className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              {format(new Date(date), 'dd/MM/yyyy')}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!projection?.isExecutionComplete && (
                                <Alert className="bg-yellow-50 text-yellow-800 p-2">
                                  <Info className="w-4 h-4" />
                                  <AlertDescription>
                                    Pendiente reporte de ejecución
                                  </AlertDescription>
                                </Alert>
                              )}
                              {!isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingProjection(projection?.id)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateProjection(projection?.id, projection?.activities)}
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  Guardar
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {projection?.activities.map((activity, index) => {
                              const activityDetails = mockActivities.find(a => a.id === activity.activityId);
                              return (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <div className="flex-1 grid grid-cols-3 gap-4">
                                    <span className="font-medium">{activityDetails?.name}</span>
                                    {isEditing ? (
                                      <>
                                        <Select
                                          value={activity.contractorId}
                                          onValueChange={(value) => {
                                            const newActivities = [...projection.activities];
                                            newActivities[index].contractorId = value;
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CONTRACTORS.map(c => (
                                              <SelectItem key={c} value={c}>
                                                {c}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <Input
                                          type="number"
                                          value={activity.quantity}
                                          onChange={(e) => {
                                            const newActivities = [...projection.activities];
                                            newActivities[index].quantity = Number(e.target.value);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <span>{activity.contractorId}</span>
                                        <span>{activity.quantity} {activity.unit}</span>
                                      </>
                                    )}
                                  </div>
                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newActivities = projection.activities.filter((_, i) => i !== index);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
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

            <TabsContent value="execution">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Ejecución Diaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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

                    {selectedExecutionDate && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Actividades Programadas:</h3>
                        {getProjectionsForDate(selectedExecutionDate)?.activities.map((activity, index) => {
                          const activityDetails = mockActivities.find(a => a.id === activity.activityId);
                          const executionDetails = executionData[activity.activityId] || {
                            quantity: 0,
                            notes: '',
                            issueCategory: undefined,
                            issueNotes: ''
                          };

                          return (
                            <Card key={index}>
                              <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">{activityDetails?.name}</h4>
                                    <p className="text-sm text-gray-500">
                                      Contratista: {activity.contractorId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Cantidad Programada: {activity.quantity} {activity.unit}
                                    </p>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Cantidad Ejecutada</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={executionDetails.quantity}
                                        onChange={(e) => {
                                          setExecutionData({
                                            ...executionData,
                                            [activity.activityId]: {
                                              ...executionDetails,
                                              quantity: Number(e.target.value)
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label>Observaciones</Label>
                                      <Textarea
                                        rows={2}
                                        value={executionDetails.notes}
                                        onChange={(e) => {
                                          setExecutionData({
                                            ...executionData,
                                            [activity.activityId]: {
                                              ...executionDetails,
                                              notes: e.target.value
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label>Categoría de Novedad</Label>
                                      <Select
                                        value={executionDetails.issueCategory}
                                        onValueChange={(value: IssueCategory) => {
                                          setExecutionData({
                                            ...executionData,
                                            [activity.activityId]: {
                                              ...executionDetails,
                                              issueCategory: value
                                            }
                                          });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {ISSUE_CATEGORIES.map(category => (
                                            <SelectItem key={category} value={category}>
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {executionDetails.issueCategory === 'Otros' && (
                                      <div>
                                        <Label>Descripción de la Novedad</Label>
                                        <Input
                                          type="text"
                                          value={executionDetails.issueNotes}
                                          onChange={(e) => {
                                            setExecutionData({
                                              ...executionData,
                                              [activity.activityId]: {
                                                ...executionDetails,
                                                issueNotes: e.target.value
                                              }
                                            });
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        <div className="flex justify-end">
                          <Button onClick={() => handleExecutionSubmit(selectedExecutionDate)}>
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
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertDescription>
                  Selecciona un proyecto para comenzar.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Construction;
