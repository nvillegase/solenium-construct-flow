
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Simulate a logged-in supervisor user for development
  useEffect(() => {
    console.log("Simulating logged-in user for development");
    
    // Use the first supervisor from mock data
    const simulatedUser = mockUsers.find(u => u.role === 'Supervisor') || mockUsers[0];
    
    setUser(simulatedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Simulated login for:", email);
      
      // Find user from mock data
      const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser) {
        console.log("Using mock user:", mockUser.name);
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast({
          title: "Inicio de sesión exitoso (modo desarrollo)",
          description: `Bienvenido, ${mockUser.name}`,
        });
        setIsLoading(false);
        return true;
      } else {
        // If no mock user found, simulate a supervisor login
        const defaultUser: User = {
          id: "simulated-user-id",
          name: "Usuario Simulado",
          email: email,
          role: "Supervisor",
          projectIds: ["1", "2", "3"] // All projects
        };
        
        setUser(defaultUser);
        localStorage.setItem("user", JSON.stringify(defaultUser));
        toast({
          title: "Inicio de sesión simulado",
          description: `Bienvenido, ${defaultUser.name}`,
        });
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log("Logging out");
      setUser(null);
      localStorage.removeItem("user");
      toast({
        title: "Sesión cerrada",
        description: "Ha cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión correctamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return true; // Allow access when unprotected
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasRole,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
