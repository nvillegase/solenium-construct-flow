import React, { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Project } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface AppLayoutProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const AppLayout = ({ children, requiredRoles }: AppLayoutProps) => {
  const { isAuthenticated, hasRole, user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { toast } = useToast();

  // Fetch available projects for current user
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setLoadingProjects(true);
      try {
        // Get user's assigned projects or all projects for supervisor
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
            // No projects assigned
            setProjects([]);
            setLoadingProjects(false);
            return;
          }
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching projects:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los proyectos",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          // Map Supabase data to Project type to ensure type compatibility
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
          // Set default project if none selected
          if (mappedProjects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(mappedProjects[0].id);
          }
        }
      } catch (error) {
        console.error("Error in fetchProjects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    
    if (user) {
      fetchProjects();
    }
  }, [user, toast]);

  // Redirect to login if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solenium-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role as any))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if the user has access to multiple projects and needs project selector
  const showProjectSelector = projects.length > 0 &&
    ["Diseñador", "Residente", "Supervisor"].includes(user?.role || "");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {showProjectSelector && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <Label htmlFor="project-selector" className="whitespace-nowrap font-medium">
                  Proyecto actual:
                </Label>
                <Select
                  value={selectedProjectId || ""}
                  onValueChange={(value) => setSelectedProjectId(value)}
                  disabled={loadingProjects}
                >
                  <SelectTrigger id="project-selector" className="w-full max-w-xs">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
