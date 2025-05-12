'use client'

export default function Loader() {
  return (
    <div className="fixed top-[5.5rem] left-4 lg:left-[calc(16rem+2.5rem)] right-4 lg:right-5 bottom-0 bg-gray-900/50 flex items-center justify-center z-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4 min-w-[200px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500/30 dark:border-blue-400/30 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading</p>
          <div className="flex space-x-1 mt-1">
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
