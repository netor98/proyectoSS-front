
import { useUser } from '../../context/UserContext';
import CustomBreadCrumb from '../../components/CustomBreadCrumb';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, FileText, FlaskConical } from 'lucide-react';
import { useTheme } from '../../context/themeContext';

export default function Dashboard() {
  const { user } = useUser();
  const { theme } = useTheme();

  const researchStats = [
    {
      title: 'Card 1',
      value: '12',
      change: '+3 nuevos este mes',
      icon: FlaskConical,
      trend: 'up'
    },
    {
      title: 'Card 2',
      value: '47',
      change: '+5 publicadas este año',
      icon: FileText,
      trend: 'up'
    },
    {
      title: 'Card 3',
      value: '1,234',
      change: '+89 desde el mes pasado',
      icon: BookOpen,
      trend: 'up'
    },
    {
      title: 'Card 4',
      value: '156',
      change: '+12 nuevas conexiones',
      icon: Users,
      trend: 'up'
    }
  ];

  return (
    <div className={`flex-1 space-y-4 p-8 pt-6 min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[#080808]' : 'bg-white'
      }`}>
      <CustomBreadCrumb />

      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            ¡Bienvenido de vuelta, {user?.first_names}!
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {researchStats.map((stat, index) => (
          <Card key={index} className={`hover:shadow-lg transition-all duration-200 ${theme === 'dark'
              ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/25'
              : 'bg-white border-gray-200 hover:shadow-gray-200/50'
            }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {stat.value}
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}


