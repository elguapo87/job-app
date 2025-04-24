import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("Dashboard must be within AppContextProvider");
  const { companyData, setCompanyToken, setCompanyData } = context;

  const [showLogut, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("companyToken");
    setCompanyToken(null);
    setCompanyData(null);
    navigate("/");
  };

  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  return (
    <div className='min-h-screen'>
      {/* NAVBAR FOR RECRUITER PANEL */}
      <div className='py-2 sm:py-4 shadow'>
        <div className='px-5 flex items-center justify-between'>
          <div className='flex items-end'>
            <img onClick={() => navigate("/")} src={assets.company_logo} className='w-[130px] sm:w-[180px]  cursor-pointer ' alt="" />
            <p className='text-xs max-sm:-ml-5 max-sm:scale-[0.55] scale-[0.85] bg-blue-100 px-2.5 py-1 rounded-full font-semibold italic'>Recruiter Panel</p>
          </div>

          {
            companyData
                &&
            <div className='flex items-center gap-3'>
              <p className='max-sm:hidden'>Welcome, {companyData?.name}</p>

              <div className="relative cursor-pointer" onClick={() => setShowLogout(prev => !prev)}>
                <img className='w-8 border rounded-full aspect-square' src={companyData.image || assets.company_icon} alt="" />

                {
                  showLogut
                    &&
                  <div className='absolute top-0 right-0 z-10 text-black rounded pt-12'>
                    <button onClick={logout} className='px-3 py-1.5 bg-yellow-500 text-white rounded border-none text-sm'>Logout</button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <div className="flex items-start">
        {/* LEFT SIDEBAR */}
        <div className='inline-block min-h-screen border-r-2'>
          <ul className='flex flex-col gap-3 items-start pt-5 text-gray-800'>
      
            <NavLink className={({isActive}) => `flex items-center gap-2 p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`} to="add-job">
              <img className='min-w-4 max-sm:max-w-[20px]' src={assets.add_icon} alt="" />
              <p className='max-sm:hidden lg:text-xl'>Add Job</p>
            </NavLink>
       
            <NavLink className={({isActive}) => `flex items-center gap-2 p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`} to="manage-jobs">
              <img className='min-w-4 max-sm:max-w-[20px]' src={assets.home_icon} alt="" />
              <p className='max-sm:hidden lg:text-xl'>Manage Jobs</p>
            </NavLink>

            <NavLink className={({isActive}) => `flex items-center gap-2 p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`} to="view-applications">
              <img className='min-w-4 max-sm:max-w-[20px]' src={assets.person_tick_icon} alt="" />
              <p className='max-sm:hidden lg:text-xl'>View Applications</p>
            </NavLink>
          </ul>
        </div>
        
        <div className='flex-1 h-full sm:px-5'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
