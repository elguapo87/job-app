import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validator from "validator";

const RecruiterLogin = ({ onClose } : { onClose: () => void }) => {

  const context = useContext(AppContext);
  if (!context) throw new Error("RecruiterLogin must be within AppContextProvider");
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = context;

  const [state, setState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<any | null>(null);

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    // Frontend validation before proceeding
    if (state !== "Login" && !isTextDataSubmited) {
      if (!name || !email || !password) {
        toast.error("All fields are required.");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }

      if (!validator.isEmail(email)) {
        toast.error("Invalid email format.");
        return;
      }

      // If validation passes, proceed to next step (image upload)
      setIsTextDataSubmited(true);
      return;
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password
        });

        if (data.success) {
          toast.success(data.message);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setCompanyData(data.company);
          setShowRecruiterLogin(false);
          navigate("/dashboard");

        } else {
          toast.error(data.message);
        }

      } else {
        // Now submitting with image
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        if (image) {
          formData.append("image", image);
        }

        const { data } = await axios.post(`${backendUrl}/api/company/register`, formData);

        if (data.success) {
          toast.success(data.message);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setCompanyData(data.company);
          setShowRecruiterLogin(false);
          navigate("/dashboard");

        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errMessage);
    }
  };

  
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    }
  }, []);

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 bg-black/30 backdrop-blur-md flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">Recruiter {state}</h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {
          state !== "Login" && isTextDataSubmited
                  ?
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
              <input onChange={(e: any | null) => setImage(e.target.files[0])} type="file" id="image" hidden />
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} className="w-16 aspect-square rounded-full" alt="" />
            </label>
            <p>Upload Company <br /> Logo</p>
          </div>
                 :
          <>
            {
              state !== "Login"
                    &&
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input onChange={(e) => setName(e.target.value)} value={name} className="outline-none text-sm" type="text" placeholder="Company Name" required />
              </div>
            }
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.email_icon} alt="" />
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="outline-none text-sm" type="email" placeholder="Company Email" required />
              </div>
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.lock_icon} alt="" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="outline-none text-sm" type="password" placeholder="Company Password" required />
              </div>
          </>     
        }

        {state === "Login" && <p className="text-sm text-blue-600 mt-4 cursor-pointer">Forgot Password</p>}

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === "Login" ? "Login" : isTextDataSubmited ? "Create Account" : "Next"} 
        </button>

        {
          state === "Login"
              ?
          <p className="mt-5 text-center" onClick={() => setState("Sign Up")}>Don't have an account? <span className="text-blue-600 cursor-pointer">Sign Up</span></p>
              :
          <p className="mt-5 text-center" onClick={() => setState("Login")}>Already have an account? <span className="text-blue-600 cursor-pointer">Login</span> </p>
        }

        <img onClick={onClose} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />
      </form>
    </div>
  )
}

export default RecruiterLogin
