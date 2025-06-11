import { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useTheme } from '../../context/themeContext';
import CustomBreadCrumb from '../../components/CustomBreadCrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  X,
} from 'lucide-react';

export default function EditProfile() {
  const { user } = useContext(UserContext);
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    first_names: user?.first_names || '',
    last_names: user?.last_names || '',
    email: user?.email || '',
    phone: '',
    institution: '',
    department: '',
    position: '',
    website: '',
    orcid: '',
    research_areas: '',
    bio: '',
    degree: '',
    specialization: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      first_names: user?.first_names || '',
      last_names: user?.last_names || '',
      email: user?.email || '',
      phone: '',
      institution: '',
      department: '',
      position: '',
      website: '',
      orcid: '',
      research_areas: '',
      bio: '',
      degree: '',
      specialization: ''
    });
    setIsEditing(false);
  };

  return (
    <div className={`flex-1 space-y-6 p-8 pt-6 min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <CustomBreadCrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Perfil Académico
          </h2>
          <p className={`transition-colors ${
            theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
          }`}>
            Gestiona tu información personal y datos académicos
          </p>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={handleCancel}>
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
          <Card className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.first_names?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dr. {user?.first_names} {user?.last_names}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Investigador Principal
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
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
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nombres
                  </label>
                  <Input
                    value={formData.first_names}
                    onChange={(e) => handleInputChange('first_names', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Apellidos
                  </label>
                  <Input
                    value={formData.last_names}
                    onChange={(e) => handleInputChange('last_names', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Phone className="inline h-4 w-4 mr-1" />
                    Teléfono
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
