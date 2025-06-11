import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import { Command, PieChart, SquareTerminal } from "lucide-react"
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import CustomAvatar from "./CustomAvatar";
import { NavMain } from "./NavMain";
import { SimpleThemeToggle } from "./ThemeToggle";
import { useTheme } from "../context/themeContext";
import { Link } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      // isActive: true,
      items: [
        {
          title: "Inicio",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Pruebas",
      icon: PieChart,
      items: [
        {
          title: "Página de Prueba",
          url: "/testing",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useContext(UserContext) || { user: null };
  const { theme } = useTheme();

  return (
    <Sidebar
      variant="inset"
      {...props}
      collapsible="icon"
      className={`border-r transition-colors duration-200`}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" className="group">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">Sistema Académico</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Investigación</span>
                </div>
                <div className="ml-auto">
                  <SimpleThemeToggle />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={items} /> */}
        {/* <NavSecondary items={items} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <CustomAvatar />
      </SidebarFooter>
    </Sidebar>
  )
}

