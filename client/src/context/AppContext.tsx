import { createContext, useState } from "react";
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
    setJobs: React.Dispatch<React.SetStateAction<JobsTypes[]>>         
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState<JobsTypes[]>([]);

    // Function to fetch job data                          
    const fetchJobs = async () => {
        setJobs(jobsData);
    };

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs                               
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;