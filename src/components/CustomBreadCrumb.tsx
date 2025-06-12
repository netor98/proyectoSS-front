import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { SidebarTrigger } from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { useLocation, Link } from "react-router-dom"
import { SimpleThemeToggle } from "./ThemeToggle"

// Route labels mapping
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Perfil",
  testing: "Pruebas",
  research: "Investigación",
  projects: "Proyectos",
  publications: "Publicaciones",
  collaborators: "Colaboradores",
  data: "Datos",
  analytics: "Análisis",
  reports: "Reportes",
  auth: "Autenticación",
  login: "Iniciar Sesión",
  register: "Registrarse",
  settings: "Configuración"
}

export function CustomBreadCrumb() {
  const location = useLocation()

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '')

    if (pathSegments.length === 0) {
      return [{ label: "Inicio", href: "/dashboard", isLast: true }]
    }

    const breadcrumbs = [
      { label: "Inicio", href: "/dashboard", isLast: false }
    ]

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 h-6 w-[1px] bg-gray-800 dark:bg-gray-300"
          decorative
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator className="mx-1" />}
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href}>
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

      </div>
      <div className="ml-auto pr-4">
        <SimpleThemeToggle />
      </div>
    </header>
  )
}
export default CustomBreadCrumb;
