import { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";

const Applications = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("Applications must be within AppContextProvider");
  const { backendUrl, appliedJobs, userData, fetchUserData, fetchAppliedJobs } = context;  

  const { getToken } = useAuth();
  const { user } = useUser();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState<any | null>(null);

  // Function to update/upload user resume
  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      if (!resume) {
        toast.warn("Resume not selected");
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(`${backendUrl}/api/users/update-resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
        setIsEdit(false);
        setResume(null);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="container px-4 2xl:px-20 min-h-[70vh] mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>

        <div className="flex gap-2 mb-6 mt-3">
          {
            isEdit || userData?.resume === ""
              ?
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <input onChange={(e: any | null) => setResume(e.target.files[0])} type="file" id="resumeUpload" accept="application/pdf" hidden />
                <div className="flex items-center cursor-pointer">
                  <p className="bg-[#007AFF] text-white px-4 py-2 rounded-lg rounded-r-none">Select Resume</p>
                  <img src={assets.profile_upload_icon} className="rounded-r-lg -ml-3 h-10" alt="" />
                </div>
              </label>

              <button onClick={updateResume} className="bg-green-100 border border-green-400 rounded-lg px-4 py-2">Save</button>
              <button onClick={() => setIsEdit(false)} className="bg-red-100 border border-red-400 rounded-lg px-4 py-2">Cancel</button>
            </>
              :
            <div className="flex gap-2">
              <a className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg" href={userData?.resume} target="_blank">Resume</a>
              <button onClick={() => setIsEdit(true)} className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2">Edit</button>
            </div>
          }
        </div>

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {appliedJobs.map((app, index) => true ? (
              <tr key={index}>
                <td className="py-3 px-4 flex items-center gap-2 border-b">
                  <img className="w-8 h-8" src={app.companyId.image} alt="" />
                  {app.companyId.name}
                </td>
                <td className="py-2 px-4 border-b">{app.jobId.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.location}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{moment(app.date).format("ll")}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`${app.status === "Accepted" ? "bg-green-100" : app.status === "Rejected" ? "bg-red-100" : "bg-blue-100"} px-4 py-1.5 rounded`}>  
                    {app.status}
                  </span>
                </td>
              </tr>
            ) : (
              null
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  )
}

export default Applications
