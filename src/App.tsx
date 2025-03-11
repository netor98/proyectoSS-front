import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/dashboard/Dashboard'
import { Toaster } from 'react-hot-toast'
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/login" element={<AuthLayout> <Login /> </AuthLayout>} />
        <Route path="/auth/register" element={<AuthLayout> <Register /> </AuthLayout>} />

      </Routes>
    </>
  )
}

export default App


