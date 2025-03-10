export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2] p-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        {children}
      </div>
    </div>
  );
}
