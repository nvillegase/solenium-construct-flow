import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Activity, Contractor, DailyProjection } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface DailyProjectionProps {
  currentProject: { id: string; name: string };
  activities?: Activity[];
  contractors?: Contractor[];
  isLoadingActivities: boolean;
  isLoadingContractors: boolean;
  refetchProjections: () => void;
}

export function DailyProjectionComponent({ 
  currentProject,
  activities,
  contractors,
  isLoadingActivities,
  isLoadingContractors,
  refetchProjections
}: DailyProjectionProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreatingProjection, setIsCreatingProjection] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState<DailyProjection | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [executedQuantity, setExecutedQuantity] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      
      const activity = activities?.find(a => a.id === activityId);
      if (!activity) throw new Error("Actividad no encontrada");
      
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

  return (
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
        {isLoadingActivities ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((projection) => (
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
                      setIsCreatingProjection(true);
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
                          <TableCell>{activity.name}</TableCell>
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
              <DatePicker
                date={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
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
    </Card>
  );
}
