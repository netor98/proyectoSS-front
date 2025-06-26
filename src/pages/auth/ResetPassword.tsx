import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/themeContext';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    // alert(token);
    if (!token) {
      setTokenValid(false);
      toast.error('Token de recuperación no encontrado');
    }
  }, [token]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/(?=.*[@$!%*?&])/.test(pwd)) {
      errors.push('Debe contener al menos un carácter especial (@$!%*?&)');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token de recuperación no válido');
      return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      setResetSuccess(true);
      toast.success('Contraseña restablecida exitosamente');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login', {
          state: { message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' }
        });
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error restableciendo contraseña';
      if (errorMessage.includes('expirado') || errorMessage.includes('inválido')) {
        setTokenValid(false);
      }
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
          }`}>Nombre</h3>
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Restablecer contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu nueva contraseña. Debe ser segura y fácil de recordar.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}

                  className={`w-full p-2 pr-10 mt-1 border-2 rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-1 focus:ring-slate-500
                  ${isLoading ? "opacity-30 cursor-not-allowed" : ""}
                  ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                    }`}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>Tu contraseña debe contener:</p>
                  <ul className="mt-1 space-y-1">
                    <li className={password.length >= 8 ? 'text-green-500' : 'text-red-500'}>
                      • Al menos 8 caracteres
                    </li>
                    <li className={/(?=.*[a-z])/.test(password) ? 'text-green-500' : 'text-red-500'}>
                      • Una letra minúscula
                    </li>
                    <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-500' : 'text-red-500'}>
                      • Una letra mayúscula
                    </li>
                    <li className={/(?=.*\d)/.test(password) ? 'text-green-500' : 'text-red-500'}>
                      • Un número
                    </li>
                    <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-500' : 'text-red-500'}>
                      • Un carácter especial (@$!%*?&)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}

                  className={`w-full p-2 pr-10 mt-1 border-2 rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-1 focus:ring-slate-500
                  ${isLoading ? "opacity-30 cursor-not-allowed" : ""}
                  ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-slate-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-slate-500'
                    }`}
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 text-xs text-green-500">Las contraseñas coinciden</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}

              className={`w-full p-2 flex items-center justify-center mt-2 font-bold text-white rounded-lg
                           transition-all duration-300
                           ${isLoading || validatePassword(password).length > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                           ${theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700'
                }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Restableciendo...
                </>
              ) : (
                'Restablecer contraseña'
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

export default ResetPassword;
