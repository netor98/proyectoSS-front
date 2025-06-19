import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/userContext";
import { useTheme } from "../../context/themeContext";
import { EyeIcon, EyeOff } from "lucide-react";

function Register() {

  // const { user, setUser } = useContext(UserContext);

  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setPassword] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    first_names: "",
    last_names: "",
    email: "",
    employee_number: "",
    phone_number: "",
    hashed_password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({

    first_names: "",
    last_names: "",
    email: "",
    employee_number: "",
    phone_number: "",
    hashed_password: [],
    confirmPassword: "",
  });
  // const isFormIncomplete = Object.values(data).some(value => value.trim() === "");


  const validateForm = () => {
    const newErrors = {
      first_names: "",
      last_names: "",
      email: "",
      employee_number: "",
      phone_number: "",
      hashed_password: [],
      confirmPassword: "",
    };

    if (!data.first_names.trim()) newErrors.first_names = "El nombre es obligatorio.";
    if (!data.last_names.trim()) newErrors.last_names = "El apellido es obligatorio.";

    if (!data.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Correo inválido.";
    }

    if (!data.employee_number.trim()) newErrors.employee_number = "Número de empleado obligatorio.";

    if (!data.phone_number.trim()) {
      newErrors.phone_number = "Número telefónico obligatorio.";
    } else if (!/^\d{10}$/.test(data.phone_number)) {
      newErrors.phone_number = "El número debe tener 10 dígitos.";
    }

    if (!data.hashed_password.trim()) {
      newErrors.hashed_password.push("La contraseña es obligatoria.");
    } else {
      if (data.hashed_password.length < 8) {
        newErrors.hashed_password.push("La contraseña debe tener al menos 8 caracteres.");
      }
      if (!/(?=.*[a-z])/.test(data.hashed_password)) {
        newErrors.hashed_password.push("Debe contener al menos una letra minúscula.");
      }
      if (!/(?=.*[A-Z])/.test(data.hashed_password)) {
        newErrors.hashed_password.push("Debe contener al menos una letra mayúscula.");
      }
      if (!/(?=.*\d)/.test(data.hashed_password)) {
        newErrors.hashed_password.push("Debe contener al menos un número.");
      }
      if (!/(?=.*[@$!%*?&])/.test(data.hashed_password)) {
        newErrors.hashed_password.push("Debe contener al menos un carácter especial (@$!%*?&).");
      }
    }

    if (data.confirmPassword !== data.hashed_password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (val) => Array.isArray(val) ? val.length > 0 : val !== ""
    );

    return !hasErrors;
  };


  const registerUser = async (e) => {
    e.preventDefault();


    if (!validateForm()) {
      console.log("aa");
      console.log(errors.hashed_password);
      return; // Stop if validation fails
    }

    const { first_names, last_names, email, employee_number, phone_number, hashed_password, confirmPassword } = data;

    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8000/api/auth/register', {
        first_names, last_names, email, employee_number, phone_number, hashed_password, confirmPassword
      })
      console.log(data)
      setData({})

      toast.success('Registro exitoso. Revisa tu correo para verificar tu cuenta.')
      setLoading(false);
      navigate('/auth/login');

    }
    catch (error) {
      const errorMessages = error?.response?.data?.detail;

      if (!errorMessages || !Array.isArray(errorMessages)) {
        toast.error("Ocurrió un error inesperado.");
        return;
      }

      errorMessages.forEach((message) => toast.error(message));

      setData((prevData) => {
        let updatedData = { ...prevData };

        if (errorMessages.includes("Correo ya registrado")) {
          updatedData.email = "";
        }
        if (errorMessages.includes("Número de empleado ya registrado")) {
          updatedData.employee_number = "";
        }
        if (errorMessages.includes("Número de teléfono ya registrado")) {
          updatedData.phone_number = "";
        }

        if (
          !errorMessages.includes("Correo ya registrado") &&
          !errorMessages.includes("Número de empleado ya registrado") &&
          !errorMessages.includes("Número de teléfono ya registrado")
        ) {
          updatedData = {
            ...updatedData,
            email: "",
            hashed_password: "",
            confirmPassword: "",
            employee_number: "",
            phone_number: "",
          };
        }

        setLoading(false);
        return updatedData;
      });
    }

  }

  return (
    <div className="font-roboto">

      <div className="flex justify-baseline items-center">
        <img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
        <h3 className="text-xl text-neutral-500 font-semibold">Nombre</h3>
      </div>
      <h2 className="text-4xl font-bold mb-6">Registrarme</h2>

      <form className="space-y-4" onSubmit={registerUser}>

        <div className="flex justify-between gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="names">Nombres</label>
            <input id="names" type="text" placeholder="Nombres" value={data.first_names}
              onChange={(e) => setData({ ...data, first_names: e.target.value })}
              className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`} />
            {errors.first_names && <p className="text-red-500 text-sm">{errors.first_names}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="lastnames">Apellidos</label>
            <input id="lastnames" type="text" placeholder="Apellidos" value={data.last_names}
              onChange={(e) => setData({ ...data, last_names: e.target.value })}
              className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`} />

            {errors.last_names && <p className="text-red-500 text-sm">{errors.last_names}</p>}
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" placeholder="correo@ejemplo.com" value={data.email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
            }}
            className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
              }`} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="flex justify-between gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="employee_number">Núm. Empleado</label>
            <input id="employee_number" type="text" placeholder="18021379" value={data.employee_number}
              onChange={(e) => setData({ ...data, employee_number: e.target.value })}
              className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`} />

            {errors.employee_number && <p className="text-red-500 text-sm">{errors.employee_number}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="phone_number">Núm. Teléfonico</label>
            <input id="phone_number" type="text" placeholder="6681566734" value={data.phone_number}
              onChange={(e) => setData({ ...data, phone_number: e.target.value })}
              className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`} />

            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
          </div>

        </div>


        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="password">Contraseña</label>

          <div className="relative w-full mt-1">
            <input id="password" placeholder="*******" value={data.hashed_password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setData({ ...data, hashed_password: e.target.value })}

              className={`w-full p-2 pr-10 mt-1 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                }`} />
            <div onClick={() => setPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-2.5 cursor-pointer
              transition-colors
              ${theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-700 hover:text-slate-500'
                }`}>

              {showPassword ? <EyeOff /> : <EyeIcon />}

            </div>
            {errors.hashed_password.length > 0 && (
              <ul className="text-red-500 text-sm mt-1 space-y-1">
                {errors.hashed_password.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input id="confirmPassword" type="password"
            placeholder="*******" value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            className={`w-full p-2 mt-1 border-2 border-gray-300 rounded-lg bg-gray-50
							focus:outline-none focus:ring-1 focus:border-slate-500 focus:ring-slate-500
              ${loading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
              }`} />


        </div>

        <button
          disabled={loading || data.confirmPassword !== data.hashed_password}
          className={`w-full p-2 mt-2 font-bold text-white rounded-lg
                           transition-all duration-300
                           ${loading || data.confirmPassword !== data.hashed_password ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                           ${theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-800 hover:bg-slate-700'
            }`}>
          Registrarse
        </button>
      </form>


      <p className="text-sm mt-7 text-center">
        ¿Ya tienes una cuenta?
        <Link to="/auth/login" className="ml-1 secondary-text cursor-pointer font-bold no-underline link-underline">
          Iniciar sesión
        </Link>
      </p>
    </div>

  )
}
export default Register
