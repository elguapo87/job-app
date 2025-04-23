const Loading = ({ position } : { position?: "normal" | "center" }) => {
    return (
      <div className={`w-screen h-screen flex items-center justify-center ${position === "center" && "-translate-x-[8%] -translate-y-[6%]"}`}>
          <div className="flex flex-col items-center gap-2">
              <div className="w-20 sm:w-[150px] h-20 sm:h-[150px] border-[8px] sm:border-[15px] border-gray-300 border-t-[8px] sm:border-t-[15px] border-t-blue-400 rounded-full animate-spin"></div>
              <p className="text-3xl sm:text-5xl font-semibold text-blue-500">Loading...</p>
          </div>
      </div>
    )
  }
  
  export default Loading
  