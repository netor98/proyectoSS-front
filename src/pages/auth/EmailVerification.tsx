import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    alert(token);
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token de verificación no encontrado');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus('loading');
      const response = await authService.verifyEmail(token!);
      setVerificationStatus('success');
      setMessage(response.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login', {
          state: { message: 'Email verificado exitosamente. Ya puedes iniciar sesión.' }
        });
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error verificando email';

      if (errorMessage.includes('expirado')) {
        setVerificationStatus('expired');
      } else {
        setVerificationStatus('error');
      }

      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success('Email de verificación enviado. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error enviando email de verificación';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const renderIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <RefreshCw className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-gray-500" />;
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Verificando email...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Por favor espera mientras verificamos tu email.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
              ¡Email verificado exitosamente!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirigiendo al login en 3 segundos...
            </p>
            <Link
              to="/auth/login"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Login
            </Link>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Token expirado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Reenviar verificación'
                )}
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error de verificación
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-4">
              <Link
                to="/auth/register"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir a Registro
              </Link>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  ¿Ya tienes cuenta? ¿Necesitas reenviar verificación?
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Enviando...
                      </>
                    ) : (
                      'Reenviar verificación'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          {renderIcon()}
          <div className="mt-6 w-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
