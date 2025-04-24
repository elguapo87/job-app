import { useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { assets } from "../assets/assets"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const context = useContext(AppContext);
  if (!context) throw new Error("Navbar must be within AppContextProvider");
  const { setShowRecruiterLogin, companyToken, setCompanyToken, setCompanyData } = context;

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("companyToken");
    setCompanyToken(null);
    setCompanyData(null);
  };

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between">
        <img onClick={() => navigate("/")} className="cursor-pointer w-[130px] sm:w-[180px]" src={assets.company_logo} alt="" />

        {
          user 
           ?
          <div className="flex items-center gap-3">
            <Link to="/applications">Applied Jobs</Link>
            <p>|</p>
            <p className="max-sm:hidden">Hello, {" "} {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "John Doe"}</p>
            <UserButton />
          </div>
           :
        <div className="flex items-center gap-4 max-sm:text-xs">
          {
            companyToken
                ?
            <>
              <button onClick={() => navigate("/dashboard")} className="bg-blue-500 text-white px-3 py-1.5 rounded">Dashboard</button>
              <button onClick={logout} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm max-sm:text-xs">Logout</button>
            </>
                :
            <>
              <button onClick={() => setShowRecruiterLogin(true)} className="text-gray-600">Recruiter Login</button>
              <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">Login</button>   
            </>
          }
        </div>
        }

      </div>
    </div>
  )
}

export default Navbar
