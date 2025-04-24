import moment from "moment"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

type JobsData = {
  applicantsNumber: number;
  category: string;
  companyId: string;
  date: number;
  description: string;
  level: string;
  location: string;
  salary: number;
  title: string;
  visible?: boolean;
  _id: string
};

const ManageJobs = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("ManageJobs must be within AppContextProvider");
  const { backendUrl, companyToken } = context;

  const [jobsData, setJobsData] = useState<JobsData[]>([]);

  const navigate = useNavigate();

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company-jobs`, {
        headers: { token: companyToken }
      });

      if (data.success) {
        setJobsData(data.jobsData);        

      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  // Function for change job visibility
  const changeVisibility = async (id: string) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/change-visibility`, { id }, {
        headers: { token: companyToken }
      });

      if (data.success) {
        toast.success(data.message);
        await fetchCompanyJobs();

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
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return jobsData.length > 0 ? (
    <div className='container p-1 sm:p-4 max-w-5xl'>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-xs">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
              <th className="py-1.5 sm:py-2 sm:px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Job Date</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-1.5 sm:py-2 sm:px-4 border-b text-center">Applicants</th>
              <th className="py-1.5 sm:py-2 sm:px-4 border-b text-left">Visible</th>
            </tr>
          </thead>

          <tbody>
            {jobsData.length > 0 && jobsData.map((job, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b">{job.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format("ll")}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b text-center">{job.applicantsNumber}</td>
                <td className="py-1.5 sm:py-2 sm:px-4 border-b text-left">
                  <input onChange={() => changeVisibility(job._id)} type="checkbox" className="scale-110 sm:scale-125 ml-4" checked={job.visible} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={() => navigate("/dashboard/add-job")} className="bg-black text-white max-sm:text-xs py-1 px-2 sm:py-2 sm:px-4 rounded ">Add new job</button>
      </div>
    </div>
  ) : (
    <Loading position="center" />
  )
}

export default ManageJobs
