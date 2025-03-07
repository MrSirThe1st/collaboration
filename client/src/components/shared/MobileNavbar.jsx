
import { MenuIcon, LockIcon, BellIcon, SearchIcon } from "lucide-react";


const MobileNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#111827] z-50 border-b border-gray-800">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center">
          <button className="p-2 mr-2">
            <span className="sr-only">Menu</span>
            <MenuIcon className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center">
            <LockIcon className="w-6 h-6 text-blue-400" />
            <span className="ml-1 font-bold text-white">CoFounder.</span>
          </div>
        </div>
        <div className="relative">
          <button className="p-1 relative">
            <BellIcon className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </div>
      <div className="px-3 pb-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-gray-800 text-white rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
