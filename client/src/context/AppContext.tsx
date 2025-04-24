import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

interface SearchFilter {
    title: string;
    location: string;
}

interface JobsData {
    _id: string;
    title: string; 
    location: string;
    level: string;
    companyId: {
        _id: string;
        name: string;
        email: string;
        image: string;
    };
    description: string;
    salary: number;
    date: number;
    category: string;
}

interface CompanyData {
    _id: string;
    name: string;
    email: string;
    image: string;
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    image: string;
    resume: string;
}

interface AppliedJobs {
    companyId: {
        _id: string;
        name: string;
        email: string;
        image: string;
    };
    date: number;
    jobId: {
        category: string;
        description: string;
        level: string;
        location: string;
        salary: number;
        title: string;
        _id: string;
    };
    status: string;
    userId: string;
    _id: string;
}

interface AppContextType {
    searchFilter: SearchFilter;
    setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
    isSearched: boolean;
    setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
    jobs: JobsData[];
    setJobs: React.Dispatch<React.SetStateAction<JobsData[]>>
    showRecruiterLogin: boolean;
    setShowRecruiterLogin: React.Dispatch<React.SetStateAction<boolean>>;
    backendUrl: string;
    companyToken: string | null;
    setCompanyToken: React.Dispatch<React.SetStateAction<string | null>>
    companyData: CompanyData | null;
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyData | null>>
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    fetchUserData: () => Promise<void>;
    appliedJobs: AppliedJobs[] | [];
    setAppliedJobs: React.Dispatch<React.SetStateAction<AppliedJobs[] | []>>;
    fetchAppliedJobs: () => Promise<void>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser();

    const { getToken } = useAuth(); 

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    });

    const [isSearched, setIsSearched] = useState(false);

    const [jobs, setJobs] = useState<JobsData[]>([]);

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") ? localStorage.getItem("companyToken") : null);
    
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);

    const [userData, setUserData] = useState<UserData | null>(null);

    const [appliedJobs, setAppliedJobs] = useState<AppliedJobs[] | []>([]);

    const [showEdit, setShowEdit] = useState(false)

    // Function to fetch jobs
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs/jobs`);

            if (data.success) {
                setJobs(data.jobs);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    // Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/company-data`, {
                headers: {
                    token: companyToken
                }
            });

            if (data.success) {
                setCompanyData(data.companyRest);
          
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };


    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = await getToken(); 

            const { data } = await axios.get(`${backendUrl}/api/users/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setUserData(data.user);
           
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };


    // Function to fetch applied jobs
    const fetchAppliedJobs = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get(`${backendUrl}/api/users/applied-jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setAppliedJobs(data.jobsApplied);
     
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };


    useEffect(() => {
        fetchJobs();
    }, []);


    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);


    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchAppliedJobs();
        }
    }, [user]);

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        backendUrl,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        userData, setUserData,
        fetchUserData,
        fetchAppliedJobs,
        appliedJobs, setAppliedJobs,
        showEdit, setShowEdit
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;