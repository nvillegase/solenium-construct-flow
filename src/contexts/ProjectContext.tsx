
import React, { createContext, useContext, useState, useEffect } from "react";
import { Project } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { mockProjects } from "@/lib/mock-data";
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
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use mock data instead of Supabase
      let filteredProjects = mockProjects;
      
      if (user.role !== 'Supervisor') {
        // For non-supervisors, filter by user's assigned projects
        filteredProjects = mockProjects.filter(project => 
          user.projectIds.includes(project.id)
        );
      }

      setProjects(filteredProjects);

      // Set first project as selected if none is selected
      if (!selectedProjectId && filteredProjects.length > 0) {
        setSelectedProjectId(filteredProjects[0].id);
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
