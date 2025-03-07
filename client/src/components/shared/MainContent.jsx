import { GlobeIcon } from "lucide-react";
import ProjectList


const MainContent = () => {
  return (
    <main className="pt-[104px] pb-16 px-3 bg-[#111827]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-white text-sm font-medium">Available</h2>
        <button className="flex items-center text-gray-400 text-sm">
          <GlobeIcon className="w-4 h-4 mr-1" />
          <span>Available</span>
        </button>
      </div>

      <ProjectList />
    </main>
  );
};


export default MainContent
