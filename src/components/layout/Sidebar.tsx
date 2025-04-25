
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Clipboard, 
  ShoppingBag, 
  Package, 
  HardHat, 
  BarChart4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { hasRole } = useAuth();
  
  // Navigation items with role-based access
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home size={20} />,
      roles: ["Diseñador", "Suministro", "Almacenista", "Residente", "Supervisor"],
    },
    {
      name: "Diseño",
      path: "/diseno",
      icon: <Clipboard size={20} />,
      roles: ["Diseñador", "Supervisor"],
    },
    {
      name: "Suministro",
      path: "/suministro",
      icon: <ShoppingBag size={20} />,
      roles: ["Suministro", "Supervisor"],
    },
    {
      name: "Inventario",
      path: "/inventario",
      icon: <Package size={20} />,
      roles: ["Almacenista", "Supervisor"],
    },
    {
      name: "Obra",
      path: "/obra",
      icon: <HardHat size={20} />,
      roles: ["Residente", "Supervisor"],
    },
    {
      name: "Supervisión",
      path: "/supervision",
      icon: <BarChart4 size={20} />,
      roles: ["Supervisor"],
    },
  ];
  
  // Filter items by user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => hasRole(role as any))
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-solenium-green flex items-center justify-center text-white font-bold">S</div>
            <span className="text-lg font-medium">Solenium</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md group",
                  isActive
                    ? "bg-solenium-lightgreen text-solenium-green"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <Separator />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="px-3 py-2 text-xs text-gray-500">
            <p>Constructómetro v1.0</p>
            <p>© 2024 Solenium</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
