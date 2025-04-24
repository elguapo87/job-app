import Quill from "quill";
import { useContext, useEffect, useRef, useState } from "react"
import { JobCategories, JobLocations } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const AddJob = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("AddJob must be within AppContextProvider");
  const { backendUrl, companyToken } = context;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("Belgrade");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState<any>(0)

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
        quillRef.current = new Quill(editorRef.current, {
        theme: "snow"
      });
    }
  }, []);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const description = quillRef.current?.root.innerHTML || "";

      if (!title || !category || !location || !level || !salary || !description) {
        toast.warn("All fields must be filled in");
      }

      const { data } = await axios.post(`${backendUrl}/api/company/post-job`, {
        title,
        category,
        location,
        level,
        salary,
        description
      }, {
        headers: { token: companyToken }
      });

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input onChange={(e) => setTitle(e.target.value)} value={title} className="w-full max-w-lg px-3 py-2 border-2 border-gray-300" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            {JobCategories.map((category, index) => (
              <option key={index}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select onChange={(e) => setLocation(e.target.value)} value={location} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select onChange={(e) => setLevel(e.target.value)} value={level} className="w-full px-3 py-2 border-2 border-gray-300 rounded">
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2">Job Salary</p>
        <input className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" type="number" min={0} onChange={(e) => setSalary(e.target.value)} value={salary} />
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white rounded">ADD</button>
    </form>
  )
}

export default AddJob
