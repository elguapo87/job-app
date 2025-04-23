import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"
import RecruiterLogin from "./components/RecruiterLogin"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import Dashboard from "./pages/Dashboard"
import AddJob from "./pages/AddJob"
import ManageJobs from "./pages/ManageJobs"
import ViewApplications from "./pages/ViewApplications"
import "quill/dist/quill.snow.css"

const App = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("App must be inside AppContextProvider");

  const { showRecruiterLogin } = context;

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        {/* RECRUITER ROUTES */}                               
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="menage-jobs" element={<ManageJobs />} />
          <Route path="view-applicaitons" element={<ViewApplications />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App