import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useNavigate } from "react-router-dom";

export default function CustomAvatar() {
  const { user, logout } = useContext(UserContext);
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={`flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md p-2 transition-all duration-300 w-full ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <Avatar className={isCollapsed ? 'h-6 w-6' : ''}>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.first_names?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col w-full items-start min-w-0">
              <h3 className="text-sm font-bold text-sidebar-foreground truncate">
                {user?.first_names} {user?.last_names}
              </h3>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isCollapsed ? "right" : "top"}
        align={isCollapsed ? "start" : "center"}
        className="w-56"
      >
        {isCollapsed && (
          <>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.first_names?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold">
                  {user?.first_names} {user?.last_names}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleProfileClick}>
          <UserIcon className="mr-2 h-4 w-4" />
          Editar Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
