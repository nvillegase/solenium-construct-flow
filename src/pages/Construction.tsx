
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockActivities, mockDailyExecutions, mockWorkQuantities } from "@/lib/mock-data";
import { Activity, DailyExecution, IssueCategory } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
  'Otros'
];

const Construction = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [executions, setExecutions] = useState<DailyExecution[]>(mockDailyExecutions);
  const { toast } = useToast();
  
  // Form states
  const [newActivity, setNewActivity] = useState({
    name: "",
    contractor: "",
    estimatedQuantity: 0,
    unit: "",
    date: new Date().toISOString().split('T')[0],
  });
  
  const [newExecution, setNewExecution] = useState({
    activityId: "",
    executedQuantity: 0,
    date: new Date().toISOString().split('T')[0],
    notes: "",
    issueCategory: undefined as IssueCategory | undefined,
    issueOtherDescription: ""
  });
  
  // Reset form functions
  const resetActivityForm = () => {
    setNewActivity({
      name: "",
      contractor: "",
      estimatedQuantity: 0,
      unit: "",
      date: new Date().toISOString().split('T')[0],
    });
  };
  
  const resetExecutionForm = () => {
    setNewExecution({
      activityId: "",
      executedQuantity: 0,
      date: new Date().toISOString().split('T')[0],
      notes: "",
      issueCategory: undefined,
      issueOtherDescription: ""
    });
  };
  
  // Create new activity
  const createActivity = () => {
    // Validation
    if (!newActivity.name.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un nombre para la actividad",
        variant: "destructive"
      });
      return;
    }
    
    if (!newActivity.contractor.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un contratista",
        variant: "destructive"
      });
      return;
    }
    
    if (newActivity.estimatedQuantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad estimada debe ser mayor a cero",
        variant: "destructive"
      });
      return;
    }
    
    if (!newActivity.unit.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar una unidad de medida",
        variant: "destructive"
      });
      return;
    }
    
    // Create new activity
    const workQuantity = mockWorkQuantities.find(wq => wq.description === newActivity.name);
    
    const newActivityRecord: Activity = {
      id: `act-${Date.now()}`,
      projectId: "project-1", // Default project ID
      workQuantityId: workQuantity?.id || "",
      name: newActivity.name,
      contractor: newActivity.contractor,
      estimatedQuantity: newActivity.estimatedQuantity,
      executedQuantity: 0,
      unit: newActivity.unit,
      date: newActivity.date,
      expectedExecutionDate: workQuantity?.expectedExecutionDate,
      progress: 0
    };
    
    setActivities([newActivityRecord, ...activities]);
    
    toast({
      title: "Actividad creada",
      description: `Se ha creado la actividad "${newActivityRecord.name}"`
    });
    
    resetActivityForm();
  };
  
  // Create new execution record
  const createExecution = () => {
    // Validation
    if (!newExecution.activityId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una actividad",
        variant: "destructive"
      });
      return;
    }
    
    if (newExecution.executedQuantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad ejecutada debe ser mayor a cero",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected activity
    const selectedActivity = activities.find(a => a.id === newExecution.activityId);
    
    if (!selectedActivity) {
      toast({
        title: "Error",
        description: "Actividad no encontrada",
        variant: "destructive"
      });
      return;
    }
    
    // Check if 'Otros' is selected but no description provided
    if (newExecution.issueCategory === 'Otros' && !newExecution.issueOtherDescription.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una descripción para la categoría 'Otros'",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate total executed so far
    const totalExecutedSoFar = executions
      .filter(e => e.activityId === newExecution.activityId)
      .reduce((sum, e) => sum + e.executedQuantity, 0);
    
    // Check if new execution would exceed the estimated quantity
    if (totalExecutedSoFar + newExecution.executedQuantity > selectedActivity.estimatedQuantity) {
      toast({
        title: "Advertencia",
        description: `La cantidad ejecutada superaría la estimada. ¿Desea continuar?`,
        action: <Button onClick={() => confirmExecution(selectedActivity)}>Continuar</Button>
      });
      return;
    }
    
    // Proceed with execution creation
    createExecutionRecord(selectedActivity);
  };
  
  // Confirm execution that exceeds estimated quantity
  const confirmExecution = (activity: Activity) => {
    createExecutionRecord(activity);
  };
  
  // Create execution record and update activity
  const createExecutionRecord = (activity: Activity) => {
    // Create new execution record
    const newExecutionRecord: DailyExecution = {
      id: `exe-${Date.now()}`,
      projectId: "project-1", // Default project ID
      activityId: newExecution.activityId,
      activityName: activity.name,
      executedQuantity: newExecution.executedQuantity,
      date: newExecution.date,
      notes: newExecution.notes,
      issueCategory: newExecution.issueCategory,
      issueOtherDescription: newExecution.issueOtherDescription
    };
    
    setExecutions([newExecutionRecord, ...executions]);
    
    // Update activity progress
    const updatedActivities = activities.map(act => {
      if (act.id === activity.id) {
        const totalExecuted = executions
          .filter(e => e.activityId === activity.id)
          .reduce((sum, e) => sum + e.executedQuantity, 0) + newExecution.executedQuantity;
        
        const progress = Math.min(
          Math.round((totalExecuted / act.estimatedQuantity) * 100),
          100
        );
        
        return {
          ...act,
          executedQuantity: totalExecuted,
          progress
        };
      }
      return act;
    });
    
    setActivities(updatedActivities);
    
    toast({
      title: "Ejecución registrada",
      description: `Se ha registrado la ejecución de ${newExecution.executedQuantity} ${activity.unit} de ${activity.name}`
    });
    
    resetExecutionForm();
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
                <CardTitle>Proyectar Nueva Actividad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-name">Actividad</Label>
                    <Select 
                      value={newActivity.name}
                      onValueChange={(value) => {
                        const workQuantity = mockWorkQuantities.find(wq => wq.description === value);
                        setNewActivity({
                          ...newActivity, 
                          name: value,
                          estimatedQuantity: workQuantity?.quantity || 0,
                          unit: workQuantity?.unit || ""
                        });
                      }}
                    >
                      <SelectTrigger id="activity-name">
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockWorkQuantities.map(wq => (
                          <SelectItem key={wq.id} value={wq.description}>
                            {wq.description}
                            {wq.expectedExecutionDate && ` (Fecha esperada: ${format(new Date(wq.expectedExecutionDate), 'dd/MM/yyyy')})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-contractor">Contratista</Label>
                    <Input
                      id="activity-contractor"
                      placeholder="Nombre del contratista"
                      value={newActivity.contractor}
                      onChange={e => setNewActivity({...newActivity, contractor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-quantity">Cantidad Estimada</Label>
                    <Input
                      id="activity-quantity"
                      type="number"
                      min="1"
                      value={newActivity.estimatedQuantity}
                      onChange={e => setNewActivity({...newActivity, estimatedQuantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-unit">Unidad</Label>
                    <Input
                      id="activity-unit"
                      placeholder="Unidad de medida"
                      value={newActivity.unit}
                      onChange={e => setNewActivity({...newActivity, unit: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-date">Fecha</Label>
                    <Input
                      id="activity-date"
                      type="date"
                      value={newActivity.date}
                      onChange={e => setNewActivity({...newActivity, date: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetActivityForm}>
                  Limpiar
                </Button>
                <Button onClick={createActivity} className="bg-solenium-blue hover:bg-blue-600">
                  Proyectar Actividad
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actividades Proyectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Actividad</th>
                        <th className="text-left p-2">Contratista</th>
                        <th className="text-left p-2">Cant. Estimada</th>
                        <th className="text-left p-2">Cant. Ejecutada</th>
                        <th className="text-left p-2">Unidad</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Fecha Esperada</th>
                        <th className="text-left p-2">Avance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map(activity => (
                        <tr key={activity.id} className="border-b">
                          <td className="p-2">{activity.name}</td>
                          <td className="p-2">{activity.contractor}</td>
                          <td className="p-2">{activity.estimatedQuantity}</td>
                          <td className="p-2">{activity.executedQuantity}</td>
                          <td className="p-2">{activity.unit}</td>
                          <td className="p-2">{format(new Date(activity.date), 'dd/MM/yyyy')}</td>
                          <td className="p-2">{activity.expectedExecutionDate ? format(new Date(activity.expectedExecutionDate), 'dd/MM/yyyy') : 'No definida'}</td>
                          <td className="p-2 w-36">
                            <div className="flex items-center gap-2">
                              <Progress value={activity.progress} className="h-2" />
                              <span className="text-xs font-medium">{activity.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Execution Tab */}
          <TabsContent value="execution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Ejecución Diaria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="execution-activity">Actividad</Label>
                    <Select
                      value={newExecution.activityId}
                      onValueChange={(value) => setNewExecution({...newExecution, activityId: value})}
                    >
                      <SelectTrigger id="execution-activity">
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities.map(activity => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name} ({activity.progress}% completado)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="execution-date">Fecha</Label>
                    <Input
                      id="execution-date"
                      type="date"
                      value={newExecution.date}
                      onChange={e => setNewExecution({...newExecution, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="execution-quantity">Cantidad Ejecutada</Label>
                    <Input
                      id="execution-quantity"
                      type="number"
                      min="1"
                      value={newExecution.executedQuantity}
                      onChange={e => setNewExecution({...newExecution, executedQuantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  {newExecution.activityId && (
                    <div className="space-y-2">
                      <Label>Información</Label>
                      <div className="text-sm space-y-1">
                        {(() => {
                          const activity = activities.find(a => a.id === newExecution.activityId);
                          if (!activity) return null;
                          
                          const totalExecuted = executions
                            .filter(e => e.activityId === activity.id)
                            .reduce((sum, e) => sum + e.executedQuantity, 0);
                          
                          return (
                            <>
                              <p>Unidad: <span className="font-medium">{activity.unit}</span></p>
                              <p>Estimado: <span className="font-medium">{activity.estimatedQuantity} {activity.unit}</span></p>
                              <p>Ejecutado: <span className="font-medium">{totalExecuted} {activity.unit}</span></p>
                              <p>Pendiente: <span className="font-medium">{Math.max(0, activity.estimatedQuantity - totalExecuted)} {activity.unit}</span></p>
                              {activity.expectedExecutionDate && (
                                <p>Fecha esperada: <span className="font-medium">{format(new Date(activity.expectedExecutionDate), 'dd/MM/yyyy')}</span></p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="execution-notes">Novedades (Notas Generales)</Label>
                  <Textarea
                    id="execution-notes"
                    placeholder="Ingrese novedades o comentarios sobre la ejecución"
                    value={newExecution.notes}
                    onChange={e => setNewExecution({...newExecution, notes: e.target.value})}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Categoría de Novedad</Label>
                  <RadioGroup
                    value={newExecution.issueCategory}
                    onValueChange={(value) => setNewExecution({
                      ...newExecution, 
                      issueCategory: value as IssueCategory,
                      issueOtherDescription: value !== 'Otros' ? '' : newExecution.issueOtherDescription
                    })}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ISSUE_CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <RadioGroupItem value={category} id={`category-${category}`} />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  
                  {newExecution.issueCategory === 'Otros' && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="other-description">Especificar</Label>
                      <Input
                        id="other-description"
                        placeholder="Describa la novedad"
                        value={newExecution.issueOtherDescription}
                        onChange={e => setNewExecution({...newExecution, issueOtherDescription: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetExecutionForm}>
                  Limpiar
                </Button>
                <Button onClick={createExecution} className="bg-solenium-blue hover:bg-blue-600">
                  Registrar Ejecución
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Ejecuciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Actividad</th>
                        <th className="text-left p-2">Cantidad Ejecutada</th>
                        <th className="text-left p-2">Categoría</th>
                        <th className="text-left p-2">Novedades</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executions.map(execution => (
                        <tr key={execution.id} className="border-b">
                          <td className="p-2">{format(new Date(execution.date), 'dd/MM/yyyy')}</td>
                          <td className="p-2">{execution.activityName}</td>
                          <td className="p-2">{execution.executedQuantity}</td>
                          <td className="p-2">{execution.issueCategory || 'N/A'}</td>
                          <td className="p-2 max-w-xs truncate">{execution.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
