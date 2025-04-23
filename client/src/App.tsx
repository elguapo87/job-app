import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"
import RecruiterLogin from "./components/RecruiterLogin"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"

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
      </Routes>
    </div>
  )
}

export default App