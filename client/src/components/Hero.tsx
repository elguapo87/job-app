import { useContext, useRef } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Hero = () => {

  const context = useContext(AppContext);
  if (!context) throw new Error("Hero must be within AppContextProvider");
  const { setSearchFilter, setIsSearched } = context;

  const titleRef = useRef<HTMLInputElement | null>(null);
  const locationRef = useRef<HTMLInputElement | null>(null);

  const onSearch = () => {
    if (titleRef.current && locationRef.current) {
      setSearchFilter({
        title: titleRef.current.value,
        location: locationRef.current.value    
      });

      setIsSearched(true);
    }    
  };  

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      <div className="hero-container">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">Over 1000+ jobs to apply</h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5"><span className="font-semibold text-base">Your Next Big Career Move</span> Starts Right Here - Exoplore the Best Job Opportunities and Take the First Step Towards Your Future!</p>

        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
            <div className="flex items-center">
                <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
                <input ref={titleRef} type="text" placeholder="Search for jobs" className="max-sm:text-xs p-2 rounded outline-none w-full" />
            </div>

            <div className="flex items-center">
                <img src={assets.location_icon} alt="" />
                <input ref={locationRef} type="text" placeholder="Location" className="max-sm:text-xs p-2 rounded outline-none w-full" />
            </div>

            <button onClick={onSearch} className="bg-blue-600 px-6 py-2 rounded text-white m-1">Search</button>
        </div>
      </div>

      <div className="flex border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md">
        <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
            <p className="font-medium">Trusted by</p>
            <img className="h-6" src={assets.microsoft_logo} alt="" />
            <img className="h-6" src={assets.walmart_logo} alt="" />
            <img className="h-6" src={assets.accenture_logo} alt="" />
            <img className="h-6" src={assets.samsung_logo} alt="" />
            <img className="h-6" src={assets.amazon_logo} alt="" />
            <img className="h-6" src={assets.adobe_logo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero
