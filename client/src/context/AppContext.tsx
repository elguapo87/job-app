import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

interface SearchFilter {
    title: string;
    location: string
}

interface JobsTypes {           
    _id: string;
    title: string;
    location: string;
    level: string;
    companyId: {
        _id: string;
        name: string;
        email: string;
        image: string
    };
    description: string;
    salary: number;
    date: number;
    category: string;
}

interface AppContextType {
    searchFilter: SearchFilter;
    setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
    isSearched: boolean;
    setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
    jobs: JobsTypes[];                                                  
    setJobs: React.Dispatch<React.SetStateAction<JobsTypes[]>>;
    showRecruiterLogin: boolean;                                                   
    setShowRecruiterLogin: React.Dispatch<React.SetStateAction<boolean>>;          
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState<JobsTypes[]>([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false); 

    // Function to fetch job data                          
    const fetchJobs = async () => {
        setJobs(jobsData);
    };

    useEffect(() => {                              
        fetchJobs();
    }, []);

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin                               
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;