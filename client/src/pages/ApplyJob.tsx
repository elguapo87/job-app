import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {

  const { id } = useParams();

  const context = useContext(AppContext);
  if (!context) throw new Error("ApplyJob must be within AppContextProvider");
  const { jobs, backendUrl, userData, fetchAppliedJobs, appliedJobs } = context;

  const { getToken } = useAuth();

  const [jobData, setJobData] = useState<any | null>(null);

  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const navigate = useNavigate();

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);

      if (data.success) {
        setJobData(data.job);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };


  // Function to apply for job
  const applyForJob = async (jobId: string) => {
    try {
      if (!userData) {
        return toast.error("Login to apply for jobs");
      }

      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Upload resume to apply");
      }

      const token = await getToken();

      const { data } = await axios.post(`${backendUrl}/api/users/job-apply`, { jobId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await fetchAppliedJobs();

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };


  const checkIsAlreadyApplied = () => {
    const hasApplied = appliedJobs.some((item) => item?.jobId?._id === jobData?._id); 
    setIsAlreadyApplied(hasApplied);
  };
  

  useEffect(() => {
    fetchJob();
  }, [id]);
  

  useEffect(() => {
    if (appliedJobs.length > 0 && jobData) {
      checkIsAlreadyApplied();
    }
  }, [appliedJobs, jobData, id]);

  return jobData ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <img className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border" src={jobData.companyId.image || assets.company_icon} alt="" />

              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{jobData.title}</h1>

                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>

                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    Net Salary: {jobData.salary} €
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-center text-sm max-md:mx-auto">
              <button onClick={() => applyForJob(jobData._id)} className="bg-blue-600 p-2.5 px-10 text-white rounded">{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
              <p className="mt-1 text-gray-600">Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{__html: jobData.description}}></div>
              <button onClick={() => applyForJob(jobData._id)} className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10">{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
            </div>

            {/* RIGHT SECTION MORE JOBS */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from <span className="font-semibold text-lg">{jobData.companyId.name}</span></h2>
              {jobs.filter((job) => job._id !== jobData._id && job.companyId.name === jobData.companyId.name && (job as any).visible && !new Set(appliedJobs.map((app) => app.jobId?._id)).has(job._id))
                .slice(0, 4).map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading position="normal" />
  )
}

export default ApplyJob
