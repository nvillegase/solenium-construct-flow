
import { User } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
}

const Header = ({ sidebarOpen, setSidebarOpen, user }: HeaderProps) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center h-16 px-4">
      <Button
        variant="ghost"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <div className="flex-1 flex justify-between items-center">
        <div className="flex-1 px-4 text-xl font-medium md:text-2xl hidden sm:block">
          Constructómetro
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-solenium-blue text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <UserIcon size={16} />
                <span>{user?.name || "Usuario"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{user?.role || "Rol no definido"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500 flex items-center gap-2">
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
