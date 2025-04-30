
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Activity, IssueCategory } from "@/lib/types";
import { Constants } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

interface DailyExecutionProps {
  currentProject: { id: string; name: string };
  activities?: Activity[];
  isLoadingActivities: boolean;
  refetchExecutions: () => void;
  selectedExecutionDate: Date;
  setSelectedExecutionDate: (date: Date) => void;
}

export function DailyExecutionComponent({
  currentProject,
  activities,
  isLoadingActivities,
  refetchExecutions,
  selectedExecutionDate,
  setSelectedExecutionDate
}: DailyExecutionProps) {
  const { toast } = useToast();
  const [isViewingExecutions, setIsViewingExecutions] = useState(false);
  const [isCreatingExecution, setIsCreatingExecution] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [executedQuantity, setExecutedQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [issueCategory, setIssueCategory] = useState<IssueCategory | undefined>(undefined);
  const [issueOtherDescription, setIssueOtherDescription] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to fetch executions when the date changes
  useEffect(() => {
    if (isViewingExecutions && selectedExecutionDate) {
      refetchExecutions();
    }
  }, [selectedExecutionDate, isViewingExecutions, refetchExecutions]);

  // Reset selected activity when activities change
  useEffect(() => {
    setSelectedActivity(null);
  }, [activities]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
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
      
      const photoUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `executions/${currentProject.id}/${fileName}`;
          
          photoUrls.push(filePath);
        }
      }
      
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

  return (
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
            
            {isLoadingActivities ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : activities && activities.length > 0 ? (
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
                  {activities.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell>{execution.name}</TableCell>
                      <TableCell>{execution.contractorName}</TableCell>
                      <TableCell>{execution.executedQuantity}</TableCell>
                      <TableCell>
                        {execution.notes ? (
                          <Badge variant="secondary">{execution.notes}</Badge>
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
    </Card>
  );
}
