import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../../context/themeContext";

function Register() {
  const { theme } = useTheme();
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

  const [loading, setLoading] = useState(false);
  const isFormIncomplete = Object.values(data).some(value => value.trim() === "");

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(data)
    e.preventDefault();
    setLoading(true);

    const { first_names, last_names, email, employee_number, phone_number, hashed_password, confirmPassword } = data;


    try {

      const response = await axios.post('http://localhost:8000/api/auth/register', {
        first_names, last_names, email, employee_number, phone_number, hashed_password, confirmPassword
      })

      // console.log("Registration successful:", response.data);
      setData({
        first_names: "",
        last_names: "",
        email: "",
        employee_number: "",
        phone_number: "",
        hashed_password: "",
        confirmPassword: ""
      });

      // Show success toast
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.', {
        style: {
          borderRadius: "10px",
          background: "#10b981",
          color: "#fff",
        },
        duration: 3000,
      });

      // Delay navigation to allow user to see the toast
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);

    } catch (error: any) {
      console.error('Registration Error:', error);

      const errorMessages = error?.response?.data?.detail;

      if (!errorMessages) {
        toast.error("Ocurrió un error inesperado.", {
          style: {
            borderRadius: "10px",
            background: "#dc2626",
            color: "#fff",
          },
          duration: 3000,
        });
        return;
      }

      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((message) => {
          toast.error(message, {
            style: {
              borderRadius: "10px",
              background: "#dc2626",
              color: "#fff",
            },
            duration: 3000,
          });
        });
      } else {
        toast.error(errorMessages, {
          style: {
            borderRadius: "10px",
            background: "#dc2626",
            color: "#fff",
          },
          duration: 3000,
        });
      }

      setData((prevData) => {
        let updatedData = { ...prevData };

        if (Array.isArray(errorMessages)) {
          if (errorMessages.includes("Correo ya registrado")) {
            updatedData.email = "";
          }
          if (errorMessages.includes("Número de empleado ya registrado")
            || errorMessages.includes("Número de empleado inválido")) {
            updatedData.employee_number = "";
          }

          if (errorMessages.includes("Número de teléfono ya registrado")
            || errorMessages.includes("Número de teléfono inválido")) {
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
        } else {
          // Single error message - clear password fields
          updatedData = {
            ...updatedData,
            hashed_password: "",
            confirmPassword: "",
          };
        }

        return updatedData;
      });
    }
    finally {
      setLoading(false);
    }
  }

  const inputClassName = `w-full p-2 mt-1 border-2 rounded-lg transition-all duration-200
		focus:outline-none focus:ring-1 focus:ring-slate-500
		${loading ? "opacity-50 cursor-not-allowed" : ""}
		${theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
    }`;

  const labelClassName = `block text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    }`;

  return (

    <div className="font-roboto">

      <div className="flex justify-baseline items-center">
        <img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
        <h3 className={`text-xl font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-neutral-500'
          }`}>Nombre</h3>
      </div>
      <h2 className={`text-4xl font-bold mb-6 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Registrarme</h2>

      <form className="space-y-4" onSubmit={registerUser}>

        <div className="flex justify-between gap-3">
          <div>
            <label className={labelClassName} htmlFor="names">Nombres</label>
            <input id="names" type="text" placeholder="Nombres" value={data.first_names}
              onChange={(e) => setData({ ...data, first_names: e.target.value })}
              className={inputClassName} />
          </div>

          <div>
            <label className={labelClassName} htmlFor="lastnames">Apellidos</label>
            <input id="lastnames" type="text" placeholder="Apellidos" value={data.last_names}
              onChange={(e) => setData({ ...data, last_names: e.target.value })}
              className={inputClassName} />
          </div>

        </div>

        <div>
          <label className={labelClassName} htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" placeholder="correo@ejemplo.com" value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={inputClassName} />
        </div>

        <div className="flex justify-between gap-3">
          <div>
            <label className={labelClassName} htmlFor="employee_number">Núm. Empleado</label>
            <input id="employee_number" type="text" placeholder="18021379" value={data.employee_number}
              onChange={(e) => setData({ ...data, employee_number: e.target.value })}
              className={inputClassName} />
          </div>

          <div>
            <label className={labelClassName} htmlFor="phone_number">Núm. Teléfonico</label>
            <input id="phone_number" type="text" placeholder="6681566734" value={data.phone_number}
              onChange={(e) => setData({ ...data, phone_number: e.target.value })}
              className={inputClassName} />
          </div>

        </div>


        <div>
          <label className={labelClassName} htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="*******" value={data.hashed_password}
            onChange={(e) => setData({ ...data, hashed_password: e.target.value })}
            className={inputClassName} />
        </div>


        <div>
          <label className={labelClassName} htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input id="confirmPassword" type="password" placeholder="*******" value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            className={inputClassName} />
        </div>

        <button
          disabled={isFormIncomplete || loading}
          className={`w-full p-2 mt-2 mb-4 font-semibold text-white rounded-lg transition-all duration-300
					${loading || isFormIncomplete ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
					${theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-800 hover:bg-slate-700'
            }`}>

          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>


      <p className={`text-sm mt-7 text-center transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
        ¿Ya tienes una cuenta?
        <Link
          to="/auth/login"
          className={`ml-1 cursor-pointer font-bold no-underline link-underline transition-colors duration-200 ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
            }`}
        >
          Iniciar sesión
        </Link>
      </p>
    </div>

  )
}
export default Register
