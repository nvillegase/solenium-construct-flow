
import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast } from "@/components/ui/use-toast";
import { Project } from "@/lib/types";

interface AppLayoutProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // We no longer need authentication or role checks here
  // as they're handled in the ProtectedRoute component
  
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
