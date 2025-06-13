import { useTheme } from "../context/themeContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-center min-h-screen p-8 transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-gray-900'
        : 'bg-gray-100'
    }`}>
      <div className={`w-full max-w-md p-8 space-y-6 shadow-2xl rounded-xl transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-gray-800 shadow-gray-900/50'
          : 'bg-white shadow-gray-200/50'
      }`}>
        {children}
      </div>
    </div>
  );
}
