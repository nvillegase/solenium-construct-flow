import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, PlusCircle, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { Activity, Contractor, DailyProjection, IssueCategory } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Constants } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker";

export default function Construction() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("daily-projection");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreatingProjection, setIsCreatingProjection] = useState(false);
  const [isCreatingExecution, setIsCreatingExecution] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState<DailyProjection | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [executedQuantity, setExecutedQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [issueCategory, setIssueCategory] = useState<IssueCategory | undefined>(undefined);
  const [issueOtherDescription, setIssueOtherDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewingExecutions, setIsViewingExecutions] = useState(false);
  const [selectedExecutionDate, setSelectedExecutionDate] = useState<Date>(new Date());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Fetch contractors
  const { data: contractors, isLoading: isLoadingContractors } = useQuery({
    queryKey: ["contractors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      // Map the database fields to our Contractor interface
      return data.map(contractor => ({
        id: contractor.id,
        name: contractor.name,
        contactPerson: contractor.contact_person,
        contactEmail: contractor.contact_email,
        contactPhone: contractor.contact_phone
      })) as Contractor[];
    },
  });

  // Fetch activities for the current project
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["activities", currentProject?.id],
    queryFn: async () => {
      if (!currentProject?.id) return [];
      
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          contractors:contractor_id(name)
        `)
        .eq("project_id", currentProject.id)
        .order("name");
      
      if (error) throw error;
      
      return data.map(activity => ({
        id: activity.id,
        projectId: activity.project_id,
        workQuantityId: activity.project_work_quantity_id,
        name: activity.name,
        contractorId: activity.contractor_id,
        contractorName: activity.contractors?.name,
        estimatedQuantity: activity.estimated_quantity,
        executedQuantity: activity.executed_quantity,
        unit: activity.unit,
        date: activity.date,
        notes: activity.notes,
        progress: activity.progress
      }));
    },
    enabled: !!currentProject?.id,
  });

  // Fetch daily projections for the selected date
  const { data: dailyProjections, isLoading: isLoadingProjections, refetch: refetchProjections } = useQuery({
    queryKey: ["dailyProjections", currentProject?.id, format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!currentProject?.id) return [];
      
      const { data, error } = await supabase
        .from("daily_projections")
        .select(`
          *,
          daily_projection_activities(
            *,
            activities:activity_id(*),
            contractors:contractor_id(name)
          )
        `)
        .eq("project_id", currentProject.id)
        .eq("date", format(selectedDate, "yyyy-MM-dd"));
      
      if (error) throw error;
      
      return data.map(projection => ({
        id: projection.id,
        projectId: projection.project_id,
        date: projection.date,
        isExecutionComplete: projection.is_execution_complete,
        activities: projection.daily_projection_activities.map((activity: any) => ({
          activityId: activity.activity_id,
          activityName: activity.activities?.name,
          contractorId: activity.contractor_id,
          contractorName: activity.contractors?.name,
          quantity: activity.quantity,
          unit: activity.unit
        }))
      }));
    },
    enabled: !!currentProject?.id && !!selectedDate,
  });

  // Fetch daily executions for the selected date
  const { data: dailyExecutions, isLoading: isLoadingExecutions, refetch: refetchExecutions } = useQuery({
    queryKey: ["dailyExecutions", currentProject?.id, format(selectedExecutionDate, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!currentProject?.id) return [];
      
      const { data, error } = await supabase
        .from("daily_executions")
        .select(`
          *,
          activities:activity_id(
            *,
            contractors:contractor_id(name)
          )
        `)
        .eq("project_id", currentProject.id)
        .eq("date", format(selectedExecutionDate, "yyyy-MM-dd"))
        .order("date", { ascending: false });
      
      if (error) throw error;
      
      return data.map((execution: any) => ({
        id: execution.id,
        projectId: execution.project_id,
        activityId: execution.activity_id,
        activityName: execution.activities?.name,
        contractorName: execution.activities?.contractors?.name,
        executedQuantity: execution.executed_quantity,
        date: execution.date,
        notes: execution.notes,
        issueCategory: execution.issue_category,
        issueOtherDescription: execution.issue_other_description
      }));
    },
    enabled: !!currentProject?.id && !!selectedExecutionDate,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
    }
  };

  const handleCreateProjection = async () => {
    if (!currentProject?.id) {
      toast({
        title: "Error",
        description: "No hay un proyecto seleccionado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the daily projection
      const { data: projectionData, error: projectionError } = await supabase
        .from("daily_projections")
        .insert({
          project_id: currentProject.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          is_execution_complete: false
        })
        .select()
        .single();
      
      if (projectionError) throw projectionError;
      
      toast({
        title: "Éxito",
        description: "Proyección diaria creada correctamente",
      });
      
      setIsCreatingProjection(false);
      refetchProjections();
    } catch (error) {
      console.error("Error creating projection:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la proyección diaria",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddActivityToProjection = async (projectionId: string, activityId: string, contractorId: string, quantity: number) => {
    if (!currentProject?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Get activity details
      const activity = activities?.find(a => a.id === activityId);
      if (!activity) throw new Error("Actividad no encontrada");
      
      // Add activity to projection
      const { error } = await supabase
        .from("daily_projection_activities")
        .insert({
          daily_projection_id: projectionId,
          activity_id: activityId,
          contractor_id: contractorId,
          quantity: quantity,
          unit: activity.unit
        });
      
      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Actividad agregada a la proyección",
      });
      
      refetchProjections();
    } catch (error) {
      console.error("Error adding activity to projection:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar la actividad a la proyección",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateExecution = async () => {
    if (!currentProject?.id || !selectedActivity) {
      toast({
        title: "Error",
        description: "Seleccione una actividad",
        variant: "destructive",
      });
      return;
    }

    if (executedQuantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad ejecutada debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Handle file uploads if any
      const photoUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `executions/${currentProject.id}/${fileName}`;
          
          // For now we'll just store the file names as placeholders
          // In a real app with backend, you would upload these files to storage
          photoUrls.push(filePath);
        }
      }
      
      // Create the daily execution
      const { error } = await supabase
        .from("daily_executions")
        .insert({
          project_id: currentProject.id,
          activity_id: selectedActivity.id,
          executed_quantity: executedQuantity,
          date: format(selectedExecutionDate, "yyyy-MM-dd"),
          notes: notes,
          issue_category: issueCategory,
          issue_other_description: issueCategory === "Otros" ? issueOtherDescription : null,
          photos: photoUrls.length > 0 ? photoUrls : null
        });
      
      if (error) throw error;
      
      // Update activity executed quantity
      const newExecutedQuantity = selectedActivity.executedQuantity + executedQuantity;
      const newProgress = Math.min(100, Math.round((newExecutedQuantity / selectedActivity.estimatedQuantity) * 100));
      
      const { error: updateError } = await supabase
        .from("activities")
        .update({
          executed_quantity: newExecutedQuantity,
          progress: newProgress
        })
        .eq("id", selectedActivity.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Éxito",
        description: "Ejecución diaria registrada correctamente",
      });
      
      setIsCreatingExecution(false);
      setSelectedActivity(null);
      setExecutedQuantity(0);
      setNotes("");
      setIssueCategory(undefined);
      setIssueOtherDescription("");
      setSelectedFiles([]);
      refetchExecutions();
    } catch (error) {
      console.error("Error creating execution:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la ejecución diaria",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">No hay proyecto seleccionado</h2>
          <Button onClick={() => navigate("/projects")}>Seleccionar Proyecto</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Construcción - {currentProject.name}</h1>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="daily-projection">Proyección Diaria</TabsTrigger>
            <TabsTrigger value="daily-execution">Ejecución Diaria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily-projection">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Proyección Diaria</CardTitle>
                  <div className="flex gap-4">
                    <DatePicker
                      date={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="w-[240px]"
                    />
                    
                    <Button onClick={() => setIsCreatingProjection(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nueva Proyección
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProjections ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : dailyProjections && dailyProjections.length > 0 ? (
                  dailyProjections.map((projection) => (
                    <Card key={projection.id} className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Proyección para {format(new Date(projection.date), "PPP", { locale: es })}
                          </CardTitle>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedProjection(projection);
                              setIsCreatingExecution(true);
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar Actividad
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {projection.activities.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Actividad</TableHead>
                                <TableHead>Contratista</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Unidad</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {projection.activities.map((activity, index) => (
                                <TableRow key={index}>
                                  <TableCell>{activity.activityName}</TableCell>
                                  <TableCell>{activity.contractorName}</TableCell>
                                  <TableCell>{activity.quantity}</TableCell>
                                  <TableCell>{activity.unit}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No hay actividades programadas
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No hay proyecciones para esta fecha</p>
                    <Button onClick={() => setIsCreatingProjection(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Proyección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Dialog open={isCreatingProjection} onOpenChange={setIsCreatingProjection}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nueva Proyección Diaria</DialogTitle>
                  <DialogDescription>
                    Crear una nueva proyección para el día {format(selectedDate, "PPP", { locale: es })}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="date" className="w-[100px]">Fecha:</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, "PPP", { locale: es })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DatePicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatingProjection(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProjection} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Proyección
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={!!selectedProjection} onOpenChange={(open) => !open && setSelectedProjection(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Actividad a la Proyección</DialogTitle>
                  <DialogDescription>
                    Seleccione una actividad para agregar a la proyección del día {selectedProjection?.date ? format(new Date(selectedProjection.date), "PPP", { locale: es }) : ""}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity">Actividad</Label>
                    <Select onValueChange={(value) => setSelectedActivity(activities?.find(a => a.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities?.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedActivity && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="contractor">Contratista</Label>
                        <Select defaultValue={selectedActivity.contractorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar contratista" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractors?.map((contractor) => (
                              <SelectItem key={contractor.id} value={contractor.id}>
                                {contractor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad ({selectedActivity.unit})</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={executedQuantity}
                          onChange={(e) => setExecutedQuantity(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedProjection(null)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedProjection && selectedActivity) {
                        handleAddActivityToProjection(
                          selectedProjection.id,
                          selectedActivity.id,
                          selectedActivity.contractorId,
                          executedQuantity
                        );
                        setSelectedProjection(null);
                        setSelectedActivity(null);
                        setExecutedQuantity(0);
                      }
                    }}
                    disabled={!selectedActivity || executedQuantity <= 0 || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Agregar Actividad
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="daily-execution">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Ejecución Diaria</CardTitle>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setIsViewingExecutions(!isViewingExecutions)}>
                      {isViewingExecutions ? "Registrar Ejecución" : "Ver Ejecuciones"}
                    </Button>
                    {!isViewingExecutions && (
                      <Button onClick={() => setIsCreatingExecution(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Ejecución
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isViewingExecutions ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <DatePicker
                        date={selectedExecutionDate}
                        onSelect={(date) => date && setSelectedExecutionDate(date)}
                        className="w-[240px]"
                      />
                      <Button variant="outline" onClick={() => refetchExecutions()}>
                        Actualizar
                      </Button>
                    </div>
                    
                    {isLoadingExecutions ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : dailyExecutions && dailyExecutions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Actividad</TableHead>
                            <TableHead>Contratista</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Novedad</TableHead>
                            <TableHead>Notas</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyExecutions.map((execution) => (
                            <TableRow key={execution.id}>
                              <TableCell>{execution.activityName}</TableCell>
                              <TableCell>{execution.contractorName}</TableCell>
                              <TableCell>{execution.executedQuantity}</TableCell>
                              <TableCell>
                                {execution.issueCategory ? (
                                  <Badge variant={execution.issueCategory === "Sin novedad" ? "outline" : "secondary"}>
                                    {execution.issueCategory}
                                    {execution.issueCategory === "Otros" && execution.issueOtherDescription ? 
                                      `: ${execution.issueOtherDescription}` : ""}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>{execution.notes || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No hay ejecuciones registradas para esta fecha</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Registre la ejecución diaria de actividades</p>
                    <Button onClick={() => setIsCreatingExecution(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Registrar Ejecución
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Dialog open={isCreatingExecution} onOpenChange={setIsCreatingExecution}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Ejecución Diaria</DialogTitle>
                  <DialogDescription>
                    Registre la ejecución de una actividad para el día {format(selectedExecutionDate, "PPP", { locale: es })}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="execution-date" className="w-[100px]">Fecha:</Label>
                    <DatePicker
                      date={selectedExecutionDate}
                      onSelect={(date) => date && setSelectedExecutionDate(date)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity">Actividad</Label>
                    <Select onValueChange={(value) => setSelectedActivity(activities?.find(a => a.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {activities?.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name} ({activity.progress}% completado)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedActivity && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Contratista</Label>
                          <div className="p-2 border rounded-md mt-1">
                            {selectedActivity.contractorName || "No asignado"}
                          </div>
                        </div>
                        <div>
                          <Label>Unidad</Label>
                          <div className="p-2 border rounded-md mt-1">
                            {selectedActivity.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cantidad Estimada</Label>
                          <div className="p-2 border rounded-md mt-1">
                            {selectedActivity.estimatedQuantity}
                          </div>
                        </div>
                        <div>
                          <Label>Cantidad Ejecutada</Label>
                          <div className="p-2 border rounded-md mt-1">
                            {selectedActivity.executedQuantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="executed-quantity">Cantidad Ejecutada Hoy ({selectedActivity.unit})</Label>
                        <Input
                          id="executed-quantity"
                          type="number"
                          value={executedQuantity}
                          onChange={(e) => setExecutedQuantity(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issue-category">Novedad</Label>
                        <RadioGroup
                          value={issueCategory}
                          onValueChange={(value) => setIssueCategory(value as IssueCategory)}
                          className="grid grid-cols-2 gap-2"
                        >
                          {Constants.public.Enums.issue_category.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <RadioGroupItem value={category} id={`issue-${category}`} />
                              <Label htmlFor={`issue-${category}`} className="cursor-pointer">
                                {category}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      {issueCategory === "Otros" && (
                        <div className="space-y-2">
                          <Label htmlFor="issue-description">Descripción de la Novedad</Label>
                          <Input
                            id="issue-description"
                            value={issueOtherDescription}
                            onChange={(e) => setIssueOtherDescription(e.target.value)}
                            placeholder="Describa la novedad"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="photos">Fotos</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="photos"
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="flex-1"
                          />
                          <Button variant="outline" type="button" className="flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            Subir
                          </Button>
                        </div>
                        {selectedFiles.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">{selectedFiles.length} archivo(s) seleccionado(s)</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedFiles.map((file, index) => (
                                <Badge key={index} variant="secondary">
                                  {file.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Observaciones adicionales"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCreatingExecution(false);
                    setSelectedActivity(null);
                    setExecutedQuantity(0);
                    setNotes("");
                    setIssueCategory(undefined);
                    setIssueOtherDescription("");
                    setSelectedFiles([]);
                  }}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateExecution}
                    disabled={!selectedActivity || executedQuantity <= 0 || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Registrar Ejecución
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
