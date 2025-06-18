import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/themeContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const { user, login } = useUser();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const isFormIncomplete = Object.values(data).some(value => value.trim() === "");


  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    const { email, password } = data;

    try {
      await login(email, password);

      toast.success("¡Inicio de sesión exitoso!", {
        style: {
          borderRadius: "10px",
          background: "#10b981",
          color: "#fff",
        },
        duration: 2000,
      });

      setData({ email: "", password: "" });

    } catch (error: any) {
      console.error('Login failed:', error);

      let errorMessage = "Credenciales incorrectas";

      // Check different error response structures
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        style: {
          borderRadius: "10px",
          background: "#dc2626",
          color: "#fff",
        },
        duration: 3000,
      });

      setData({ ...data, password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-roboto">
      <div className="flex justify-baseline items-center">
        <img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
        <h3 className={`text-xl font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-neutral-500'
          }`}>Nombre</h3>
      </div>
      <h2 className={`text-4xl font-semibold mb-6 font-roboto transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Iniciar sesión</h2>

      <form className="space-y-4" onSubmit={loginUser}>
        <div>
          <label className={`block text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="text"
            placeholder="correo@ejemplo.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={`w-full p-2 mt-1 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
              }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} htmlFor="password">
            Contraseña
          </label>
          <div className="relative w-full mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="*******"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className={`w-full p-2 pr-10 mt-1 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`}
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-2.5 cursor-pointer
              transition-colors
              ${theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-700 hover:text-slate-500'
                }`}>

              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className={`w-4 h-4 mr-2 rounded border-2 transition-colors duration-200 ${theme === 'dark'
                ? 'accent-slate-400 bg-gray-700 border-gray-600'
                : 'accent-slate-700 bg-white border-gray-300'
                }`}
            />
            <label className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`} htmlFor="remember">
              Recuérdame
            </label>
          </div>
          <Link
            to="/auth/forgot-password"
            className={`text-sm font-semibold no-underline link-underline transition-colors duration-200 ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
              }`}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          // type="submit"
          disabled={loading || isFormIncomplete}
          className={`w-full p-2 mt-2 font-bold text-white rounded-lg
                           transition-all duration-300
                           ${loading || isFormIncomplete ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                           ${theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-800 hover:bg-slate-700'
            }`}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className={`text-sm mt-7 mb-7 text-center transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
        ¿No tienes una cuenta?
        <Link
          to="/auth/register"
          className={`ml-1 font-bold no-underline link-underline transition-colors duration-200 ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
            }`}
        >
          Registrarme
        </Link>
      </p>
    </div>
  );
}

export default Login;
