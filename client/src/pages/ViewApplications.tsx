import { useContext, useEffect, useState } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../components/Loading";

const ViewApplications = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("ViewApplications must be within AppContextProvider");
  const { backendUrl, companyToken } = context;

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [applicants, setApplicants] = useState<any[] | []>([]);

  const fetchApplicants = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken }
      });

      if (data.success) {
        setApplicants(data.applicants);    

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const handleChangeStatus = async (id: string, status: string) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/change-status`, { id, status }, {
        headers: {
          token: companyToken
        }
      });

      if (data.success) {
        toast.success(data.message);
        await fetchApplicants();
        setOpenDropdownId(null);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };
 
  useEffect(() => {
    if (companyToken) {
      fetchApplicants();
    }
  }, [companyToken]);

  return applicants.length > 0 ? (
    <div className='container mx-auto p-1 sm:p-4'>
      <div>
        <table className="w-full max-w-5xl bg-white border border-gray-200 max-sm:text-xs">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left max-sm:hidden">#</th>
              <th className="py-1.5 sm:py-2 sm:px-4 text-center sm:text-left">User</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Email</th>
              <th className="py-1.5 sm:py-2 sm:px-4 text-left">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-1.5 sm:py-2 sm:px-4 text-left">Resume</th>
              <th className="py-1.5 sm:py-2 sm:px-4 sm:text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((app, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b text-center max-sm:hidden">{index + 1}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b text-center flex items-center">
                  <img className="w-5 h-5 sm:w-10 sm:h-10 rounded-full aspect-square max-sm:ml-3 sm:mr-3" src={app.userId.image} alt="" />
                  <span className="max-sm:hidden">{app.userId.name}</span>
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.userId.email}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b">{app.jobId.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.location}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b">
                  <a href={app.userId.resume} target="_blank" className="bg-blue-50 max-sm:text-xs text-blue-400 px-[8px] py-[3px] sm:px-3 sm:py-1 rounded inline-flex gap-2 items-center">
                   <span className="max-sm:hidden">Resume</span> 
                   <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b relative text-center">
                  {
                    app.status === "Pending"
                         ?
                    <div className="relative inline-block">
                      <button onClick={() => toggleDropdown(app._id)} className="text-gray-500 action-button">...</button>
                      <div className={`z-10 absolute right-0 md:left-0 top-6 mt-2 w-32 bg-white border border-gray-200 rounded shadow ${openDropdownId === app._id ? "block" : "hidden"}`}>
                        <button onClick={() => handleChangeStatus(app._id, "Accepted")} className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100">Accept</button>
                        <button onClick={() => handleChangeStatus(app._id, "Rejected")} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Reject</button>
                      </div>
                    </div>
                         :
                    <div className={`text-white text-xs sm:text-sm px-[4px] py-[2px] sm:px-2 sm:py-1 rounded ${app.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}>{app.status}</div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading position="center" />
  )
}

export default ViewApplications
