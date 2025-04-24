import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

interface SearchFilter {
    title: string;
    location: string
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
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyData | null>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState<JobsData[]>([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") ? localStorage.getItem("companyToken") : null);
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);

    // Function to fetch job data                          
    const fetchJobs = async () => {
        setJobs(jobsData);
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

    useEffect(() => {                              
        fetchJobs();
    }, []);

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        backendUrl,
        companyToken, setCompanyToken,
        companyData, setCompanyData,                               
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;