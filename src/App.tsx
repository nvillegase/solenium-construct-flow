
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Design from "./pages/Design";
import Supply from "./pages/Supply";
import Inventory from "./pages/Inventory";
import Construction from "./pages/Construction";
import Supervision from "./pages/Supervision";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Protected route wrapper component
const ProtectedRoute = ({ 
  element, 
  requiredRoles 
}: { 
  element: React.ReactNode, 
  requiredRoles?: string[] 
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  
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
  
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role as any));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <>{element}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/diseno" replace />} />
      <Route path="/diseno" element={
        <ProtectedRoute 
          element={<Design />} 
          requiredRoles={['Diseñador', 'Supervisor']} 
        />
      } />
      <Route path="/suministro" element={
        <ProtectedRoute 
          element={<Supply />} 
          requiredRoles={['Suministro', 'Residente', 'Supervisor']} 
        />
      } />
      <Route path="/inventario" element={
        <ProtectedRoute 
          element={<Inventory />} 
          requiredRoles={['Almacenista', 'Residente', 'Supervisor']} 
        />
      } />
      <Route path="/obra" element={
        <ProtectedRoute 
          element={<Construction />} 
          requiredRoles={['Residente', 'Supervisor']} 
        />
      } />
      <Route path="/supervision" element={
        <ProtectedRoute 
          element={<Supervision />} 
          requiredRoles={['Supervisor']} 
        />
      } />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
