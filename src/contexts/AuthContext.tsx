
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up auth state change listener first to catch all events
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        if (session) {
          // Handle user sign in or token refresh
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(() => {
            fetchUserProfile(session);
          }, 0);
        } else {
          // User signed out
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log("Session found, fetching user profile");
          await fetchUserProfile(session);
        } else {
          console.log("No session found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoading(false);
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Separate function to fetch user profile to avoid deadlocks
  const fetchUserProfile = async (session: any) => {
    try {
      console.log("Fetching user profile for:", session.user.id);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setIsLoading(false);
        return;
      }

      // Get user's projects
      const { data: userProjects, error: projectsError } = await supabase
        .from('user_projects')
        .select('project_id')
        .eq('user_id', session.user.id);

      if (projectsError) {
        console.error("Error fetching user projects:", projectsError);
      }

      const projectIds = userProjects?.map(up => up.project_id) || [];

      // Create user object from session and profile data
      const userData: User = {
        id: session.user.id,
        name: profileData.name || session.user.email?.split('@')[0] || 'Usuario',
        email: session.user.email || '',
        role: profileData.role as UserRole,
        avatar: profileData.avatar || undefined,
        projectIds: projectIds
      };

      console.log("User data:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Attempting login for:", email);
      
      // For development, fallback to mock users if email matches
      if (process.env.NODE_ENV === 'development') {
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
        }
      }

      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error.message);
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log("Login successful for:", data.user.email);
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido!`,
        });
        // Note: user state will be set by the onAuthStateChange listener
        return true;
      }
      
      setIsLoading(false);
      return false;
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
      await supabase.auth.signOut();
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
    if (!user) return false;
    
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
