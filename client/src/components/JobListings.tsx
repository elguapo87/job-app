import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

type Job = {
  category: string;
  location: string;
  title: string;
}

const JobListings = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("JobListings must be within AppContextProvider");
  const { searchFilter, isSearched, setSearchFilter, jobs } = context;  

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setselectedLocations] = useState<string[]>([]);

  const [filteredJobs, setFilteredJobs] = useState<any[]>(jobs);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]);
  };

  const handleLocationChange = (location: string) => {
    setselectedLocations(prev => prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]);
  };

  useEffect(() => {
    const matchesCategory = (job: Job) => selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesLocation = (job: Job) => selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const matchesSearchedTitle = (job: Job) => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
    const matchesSearchedLocation = (job: Job) => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());
    
    const newFilteredJobs = jobs.slice().reverse().filter(
      (job) => matchesCategory(job) && matchesLocation(job) && matchesSearchedTitle(job) && matchesSearchedLocation(job)
    );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, searchFilter, selectedCategories, selectedLocations]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* SIDEBAR */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* SEARCH FILTER FROM HERO COMPONENT */}
        {
          isSearched && (searchFilter.title !== "" || searchFilter.location !== "")
          &&
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>

            <div className="mb-4 text-gray-600">
              {
                searchFilter.title
                &&
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} src={assets.cross_icon} className="cursor-pointer" alt="" />
                </span>
              }

              {
                searchFilter.location
                &&
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded ml-2">
                  {searchFilter.location}
                  <img onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} src={assets.cross_icon} className="cursor-pointer" alt="" />
                </span>
              }
            </div>
          </>
        }

        <button onClick={() => setShowFilter(prev => !prev)} className="lg:hidden px-6 py-1.5 rounded border border-gray-400">
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* CATEGORY FILTER */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Category</h4>

          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input className="scale-125" type="checkbox" onChange={() => handleCategoryChange(category)} checked={selectedCategories.includes(category)} />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* LOCATION FILTER */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>

          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input className="scale-125" type="checkbox" onChange={() => handleLocationChange(location)} checked={selectedLocations.includes(location)} />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* JOB LISTINGS */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
        <p className="mb-8">Get your desired job from top companies</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).filter((job) => job?.visible).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {/* PAGINATION */}
        {
          filteredJobs.length > 0
          &&
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              <img onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} src={assets.left_arrow_icon} alt="" />
            </a>

            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(((_, index) => (
              <a key={index} href="#job-list">
                <button onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? "bg-blue-100 text-blue-500" : "text-gray-500"}`}>
                  {index + 1}
                </button>
              </a>
            )))}

            <a href="#job-list">
              <img onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
            </a>
          </div>
        }
      </section>
    </div>
  )
}

export default JobListings
