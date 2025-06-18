import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
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

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Token inválido o expirado
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              El enlace de recuperación no es válido o ha expirado.
            </p>
            <div className="mt-6 space-y-4">
              <Link
                to="/auth/forgot-password"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Solicitar nuevo enlace
              </Link>
              <Link
                to="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-green-600 dark:text-green-400">
              ¡Contraseña restablecida!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Redirigiendo al login en 3 segundos...
            </p>
            <Link
              to="/auth/login"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                    <li className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                      • Al menos 8 caracteres
                    </li>
                    <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • Una letra minúscula
                    </li>
                    <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • Una letra mayúscula
                    </li>
                    <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : 'text-red-600'}>
                      • Un número
                    </li>
                    <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-600' : 'text-red-600'}>
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 text-xs text-green-600">Las contraseñas coinciden</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
