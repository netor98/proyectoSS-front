import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/themeContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { theme } = useTheme();

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
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error enviando email de recuperación';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20">
              <Mail className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Email enviado
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Hemos enviado las instrucciones de recuperación a <span className="font-medium">{email}</span>
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              Si no ves el email, revisa tu carpeta de spam.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enviar a otro email
            </button>

            <Link
              to="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingresa tu email"
              />
            </div>
          </div>

          <div>

            <button
              // type="submit"
              disabled={isLoading}
              className={`w-full p-2 flex items-center justify-center mt-2 font-bold text-white rounded-lg
                           transition-all duration-300
                           ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                           ${theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
      </div>
    </div>
  );
};

export default ForgotPassword;
