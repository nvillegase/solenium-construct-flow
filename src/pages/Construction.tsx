import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import AppLayout from "@/components/layout/AppLayout";
import { DailyProjectionComponent } from "@/components/construction/DailyProjection";
import { DailyExecutionComponent } from "@/components/construction/DailyExecution";
import { supabase } from "@/integrations/supabase/client";

export default function Construction() {
  const { user } = useAuth();
  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState("daily-projection");

  // Fetch contractors
  const { data: contractors, isLoading: isLoadingContractors } = useQuery({
    queryKey: ["contractors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
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
      return data;
    },
    enabled: !!currentProject?.id,
  });

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
            <DailyProjectionComponent
              currentProject={currentProject}
              activities={activities}
              contractors={contractors}
              isLoadingActivities={isLoadingActivities}
              isLoadingContractors={isLoadingContractors}
              refetchProjections={() => {
                // Here you would add the refetch function
              }}
            />
          </TabsContent>
          
          <TabsContent value="daily-execution">
            <DailyExecutionComponent
              currentProject={currentProject}
              activities={activities}
              isLoadingActivities={isLoadingActivities}
              refetchExecutions={() => {
                // Here you would add the refetch function
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
