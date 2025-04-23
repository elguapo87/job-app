import { createContext, useState } from "react";

interface SearchFilter {
    title: string;
    location: string
}

interface AppContextType {
    searchFilter: SearchFilter;
    setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
    isSearched: boolean;
    setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children } : { children: React.ReactNode }) => {

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    });

    const [isSearched, setIsSearched] = useState(false);

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;