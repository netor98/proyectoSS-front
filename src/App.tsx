import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/dashboard/Dashboard'
import EditProfile from './pages/profile/EditProfile'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/themeContext'
// import ProtectedRoutes from './utils/ProtectedRoutes'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSideBar'
import PageOne from './pages/testingPages/PageOne'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider>
        <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route>
            <Route path="/dashboard" element={
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">
                  <Dashboard />
                </main>
              </SidebarProvider>
            } />
            <Route path="/testing" element={
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">
                  <PageOne />
                </main>
              </SidebarProvider>
            } />
            <Route path="/profile" element={
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1">
                  <EditProfile />
                </main>
              </SidebarProvider>
            } />
          </Route>


          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<AuthLayout> <Login /> </AuthLayout>} />
          <Route path="/auth/register" element={<AuthLayout> <Register /> </AuthLayout>} />
        </Routes>
      </ThemeProvider>

    </>

  )
}

export default App


