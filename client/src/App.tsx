import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"
import { useContext, useEffect } from "react"
import { AppContext } from "./context/AppContext"
import RecruiterLogin from "./components/RecruiterLogin"
import AddJob from "./pages/AddJob"
import Dashboard from "./pages/Dashboard"
import ManageJobs from "./pages/ManageJobs"
import ViewApplications from "./pages/ViewApplications"
import "quill/dist/quill.snow.css"
import { ToastContainer } from 'react-toastify' 
import EditJob from "./pages/EditJob"

const App = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("App must be within AppContextProvider");
  const { showRecruiterLogin, setShowRecruiterLogin, companyToken } = context;

  const navigate = useNavigate();

  useEffect(() => {
    // If the user tries to access recruiter pages without a token, show the login popup
    if (!companyToken && location.pathname.startsWith("/dashboard")) {
      setShowRecruiterLogin(true);
    }
  }, [companyToken, location.pathname, setShowRecruiterLogin]);

  const handleCloseRecruiterLogin = () => {
    setShowRecruiterLogin(false);
    if (!companyToken) {
      navigate("/");
    }
  };

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin onClose={handleCloseRecruiterLogin} />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        {/* Recruiter Routes */}
        {
          companyToken
             ?
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
            <Route path="edit-job/:id" element={<EditJob />} />
          </Route>
             :
          <Route path="/dashboard" element={<RecruiterLogin onClose={handleCloseRecruiterLogin} />} />
        }
      </Routes>
    </div>
  )
}

export default App
