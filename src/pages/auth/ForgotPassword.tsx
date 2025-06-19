import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/themeContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isFormIncomplete = email.trim() === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      navigate("/auth/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error enviando email de recuperación';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-roboto">
      <div className="flex justify-baseline items-center">
        <img src="/uas_logo.png" alt="BufetePDFReaderLogo" className="h-16 w-auto mb-3" />
        <h3 className={`text-xl font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-neutral-500'
          }`}>Sistema</h3>
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <label className={`inline-block text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`} htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="text"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 mt-1 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-slate-500
              ${isLoading ? "opacity-30 cursor-not-allowed" : ""}
              ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                  }`}
              />
            </div>
          </div>

          <div>

            <button
              // type="submit"
              disabled={isLoading || isFormIncomplete}
              className={`w-full p-2 flex items-center justify-center mt-2 font-bold text-white rounded-lg
                           transition-all duration-300
                           ${isLoading || isFormIncomplete ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                           ${theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="opacity-50 cursor-not-allowed"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar instrucciones
                </>
              )}
            </button>
          </div>

          <div className="text-center">

            <Link
              to="/auth/login"
              className={`inline-flex items-center text-sm font-semibold 
                no-underline link-underline transition-colors 
                duration-200 
                ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
                }`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al login
            </Link>
          </div>
        </form>
      </div >
    </div >
  );
};

export default ForgotPassword;
