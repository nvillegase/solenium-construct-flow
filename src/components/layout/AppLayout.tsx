
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockProjects } from "@/lib/mock-data";

interface AppLayoutProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const AppLayout = ({ children, requiredRoles }: AppLayoutProps) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Get available projects for current user
  const availableProjects = mockProjects.filter(project => 
    user?.projectIds?.includes(project.id) || user?.role === "Supervisor"
  );

  // Initialize selected project from user's first project (if available)
  useEffect(() => {
    if (availableProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(availableProjects[0].id);
    }
  }, [user, availableProjects, selectedProjectId]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role as any))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if the user has access to multiple projects and needs project selector
  const showProjectSelector = availableProjects.length > 0 &&
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
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
