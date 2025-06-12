import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/themeContext';
import { userService, UpdateUserData } from '../../services/userService';
import CustomBreadCrumb from '../../components/CustomBreadCrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AvatarUpload from '../../components/AvatarUpload';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Save,
  X,
  Loader2,
} from 'lucide-react';

export default function EditProfile() {
  const { user, updateUser } = useUser();
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    first_names: user?.first_names || '',
    last_names: user?.last_names || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    employee_number: user?.employee_number || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Error: Usuario no encontrado');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for API call
      const updateData: UpdateUserData = {
        first_names: formData.first_names.trim(),
        last_names: formData.last_names.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        employee_number: formData.employee_number.trim(),
      };

      // Call API to update user
      const updatedUserData = await userService.updateProfile(user.id, updateData);

      // Update user context with new data
      updateUser({
        first_names: updatedUserData.first_names,
        last_names: updatedUserData.last_names,
        email: updatedUserData.email,
        updatedAt: new Date().toISOString(),
      });

      toast.success('Perfil actualizado correctamente', {
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);

      let errorMessage = 'Error al actualizar el perfil';

      if (error.message === 'No hay datos para actualizar') {
        errorMessage = 'No se detectaron cambios para guardar';
      } else if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica la información ingresada.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Intenta nuevamente.';
      }

      toast.error(errorMessage, {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsEditing(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_names: user?.first_names || '',
      last_names: user?.last_names || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      employee_number: user?.employee_number || '',
    });
    setIsEditing(false);
  };

  return (
    <div className={`flex-1 space-y-6 p-8 pt-6 min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <CustomBreadCrumb />
      {/* <PageLoading /> */}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            Perfil Académico
          </h2>
          <p className={`transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
            }`}>
            Gestiona tu información personal y datos académicos
          </p>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <User className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-3">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card className={`${theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
            }`}>
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <AvatarUpload
                  size="xl"
                  editable={isEditing}
                  className="mx-auto"
                />
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    {user?.first_names} {user?.last_names}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {user?.role || 'Usuario'}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className={`${theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
            }`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                <User className="h-5 w-5" />
                <span>Información Personal</span>
              </CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                Datos básicos de identificación y contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Nombres
                  </label>
                  <Input
                    value={formData.first_names}
                    onChange={(e) => handleInputChange('first_names', e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Apellidos
                  </label>
                  <Input
                    value={formData.last_names}
                    onChange={(e) => handleInputChange('last_names', e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    <Phone className="inline h-4 w-4 mr-1" />
                    Teléfono
                  </label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="mt-1"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Número de Empleado
                </label>
                <Input
                  value={formData.employee_number}
                  onChange={(e) => handleInputChange('employee_number', e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="mt-1"
                  placeholder="EMP001"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
