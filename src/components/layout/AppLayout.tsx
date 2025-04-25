
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AppLayoutProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const AppLayout = ({ children, requiredRoles }: AppLayoutProps) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Initialize selected project from user's first project (if available)
  useEffect(() => {
    if (user?.projectIds && user.projectIds.length > 0 && !selectedProjectId) {
      setSelectedProjectId(user.projectIds[0]);
    }
  }, [user, selectedProjectId]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role as any))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if the user has access to multiple projects and needs project selector
  const showProjectSelector = user?.projectIds && user.projectIds.length > 0 && 
    (hasRole('Diseñador') || hasRole('Residente') || hasRole('Supervisor'));

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
          <div className="max-w-7xl mx-auto">
            {showProjectSelector && (
              <div className="mb-6 bg-white p-4 rounded-md shadow-sm border">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="project-selector" className="font-medium text-gray-700">
                    Proyecto Actual:
                  </Label>
                  <Select
                    value={selectedProjectId || ""}
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger id="project-selector" className="w-[250px]">
                      <SelectValue placeholder="Seleccionar proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {user?.projectIds.map((projectId) => (
                        <SelectItem key={projectId} value={projectId}>
                          Proyecto {projectId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
