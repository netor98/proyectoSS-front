import CustomBreadCrumb from "../../components/CustomBreadCrumb"
import { useTheme } from "../../context/themeContext";

const PageOne = () => {
  const { theme } = useTheme();


  return (

    <div className={`flex-1 space-y-4 p-8 pt-6 min-h-screen transition-colors duration-200 
      ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'}`} >
      <CustomBreadCrumb />
      <h1>Page One</h1>
    </div >
  )
}
export default PageOne

