import Quill from "quill";
import { useContext, useEffect, useRef, useState } from "react"
import { JobCategories, JobLocations } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const EditJob = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("EditJob must be within AppContextProvider");
  const { backendUrl, companyToken, setShowEdit } = context;

  const { id } = useParams();

  const [job, setJob] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("Belgrade");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState<any>(0)

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const navigate = useNavigate();

  const fetchJob = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);

        if (data.success) {
            setJob(data.job);

        } else {
            toast.error(data.message);
        }

    } catch (error) {
        const errMsg = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errMsg);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
        quillRef.current = new Quill(editorRef.current, {
        theme: "snow"
      });
    }

    // Set the Quill content when job.description is available
    if (quillRef.current && job?.description) {
        quillRef.current.root.innerHTML = job.description;
    }

  }, [job]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const description = quillRef.current?.root.innerHTML || "";

      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);

      const { data } = await axios.post(`${backendUrl}/api/company/update-job`, {
        id,
        title: inputs.title,
        category: inputs.category,
        location: inputs.location,
        level: inputs.level,
        salary: Number(inputs.salary) || 0,
        description
      }, {
        headers: { token: companyToken }
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/manage-jobs");
        setShowEdit(false);
      
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  return job && (
    <form onSubmit={handleSubmit} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input onChange={(e) => setTitle(e.target.value)} name="title" defaultValue={job.title} className="w-full max-w-lg px-3 py-2 border-2 border-gray-300" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select onChange={(e) => setCategory(e.target.value)} name="category" defaultValue={job.category} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            {JobCategories.map((category, index) => (
              <option key={index}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select onChange={(e) => setLocation(e.target.value)} name="location" defaultValue={job.location} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select onChange={(e) => setLevel(e.target.value)} name="level" defaultValue={job.level} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2">Job Salary</p>
        <input className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" type="Number" min={0} onChange={(e) => setSalary(e.target.value)} name="salary" defaultValue={job.salary} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="w-28 py-3 mt-4 bg-black text-white rounded">Update</button>
        <div onClick={() => { setShowEdit(false); navigate("/dashboard/manage-jobs")}} className="flex items-center justify-center w-28 py-3 mt-4 bg-red-500 text-white rounded cursor-pointer">Cancel</div>
      </div>
    </form>
  )
}

export default EditJob
