
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import AppLayout from "@/components/layout/AppLayout";
import { DailyProjectionComponent } from "@/components/construction/DailyProjection";
import { DailyExecutionComponent } from "@/components/construction/DailyExecution";
import { useActivities } from "@/hooks/useActivities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Contractor } from "@/lib/types";
import { mockContractors } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Construction() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { projects, selectedProjectId, setSelectedProjectId, isLoading: isLoadingProjects } = useProjects();
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("daily-projection");
  const [selectedExecutionDate, setSelectedExecutionDate] = useState<Date>(new Date());

  // Format the date for API queries
  const formattedDate = format(selectedExecutionDate, "yyyy-MM-dd");
  
  // Fetch contractors using mock data
  const { data: contractorsData, isLoading: isLoadingContractors } = useQuery({
    queryKey: ["contractors"],
    queryFn: async () => {
      try {
        // Simulate async loading
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockContractors;
      } catch (err) {
        console.error("Contractors fetch error:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar los contratistas.",
          variant: "destructive"
        });
        return [];
      }
    },
  });

  // Use the improved useActivities hook with date parameter
  const { 
    activities, 
    isLoading: isLoadingActivities, 
    error: activitiesError, 
    refetch: refetchActivities 
  } = useActivities(
    currentProject?.id, 
    selectedTab === "daily-execution" ? formattedDate : undefined
  );

  // Transform data to match our Contractor type
  const contractors: Contractor[] = contractorsData || [];

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Construcción</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Proyecto actual:</span>
            {isLoadingProjects ? (
              <div className="w-[200px] h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <Select
                value={selectedProjectId || ""}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="daily-projection">Proyección Diaria</TabsTrigger>
            <TabsTrigger value="daily-execution">Ejecución Diaria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily-projection">
            <DailyProjectionComponent
              currentProject={currentProject}
              activities={activities}
              contractors={contractors}
              isLoadingActivities={isLoadingActivities}
              isLoadingContractors={isLoadingContractors}
              refetchProjections={refetchActivities}
            />
          </TabsContent>
          
          <TabsContent value="daily-execution">
            <DailyExecutionComponent
              currentProject={currentProject}
              activities={activities}
              isLoadingActivities={isLoadingActivities}
              refetchExecutions={refetchActivities}
              selectedExecutionDate={selectedExecutionDate}
              setSelectedExecutionDate={setSelectedExecutionDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
