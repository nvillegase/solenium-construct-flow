
import React, { createContext, useContext, useState, useEffect } from "react";
import { Project } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  refetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setSelectedProjectId(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from('projects').select('*');
      
      if (user.role !== 'Supervisor') {
        // For non-supervisors, filter by user's assigned projects
        const { data: userProjects } = await supabase
          .from('user_projects')
          .select('project_id')
          .eq('user_id', user.id);
          
        const projectIds = userProjects?.map(up => up.project_id) || [];
        
        if (projectIds.length > 0) {
          query = query.in('id', projectIds);
        } else {
          setProjects([]);
          setIsLoading(false);
          return;
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const mappedProjects: Project[] = data.map(project => ({
          id: project.id,
          name: project.name,
          location: project.location,
          startDate: project.start_date,
          expectedEndDate: project.expected_end_date,
          status: project.status,
          progress: project.progress,
          projectedProgress: project.projected_progress
        }));

        setProjects(mappedProjects);

        // Set first project as selected if none is selected
        if (!selectedProjectId && mappedProjects.length > 0) {
          setSelectedProjectId(mappedProjects[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      const message = error instanceof Error ? error.message : 'Error al cargar los proyectos';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when user changes
  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Create the context value object
  const value: ProjectContextType = {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    isLoading,
    error,
    refetchProjects: fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
