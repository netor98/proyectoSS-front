import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AuthLayout from './layouts/AuthLayout'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<AuthLayout> <Login /> </AuthLayout>} />
        <Route path="/auth/register" element={<AuthLayout> <Register /> </AuthLayout>} />

      </Routes>
    </>
  )
}

export default App


