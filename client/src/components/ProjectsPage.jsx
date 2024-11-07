import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import useGetAllProjects from "@/hooks/useGetAllProjects";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { Badge } from "./ui/badge";

// Define categories
const FILTER_CATEGORIES = [
  { value: "all", label: "All Projects" },
  { value: "web development", label: "Web Development" },
  { value: "mobile development", label: "Mobile Development" },
  { value: "ui/ux design", label: "UI/UX Design" },
  { value: "data science", label: "Data Science" },
];

const ProjectsPage = ({ project }) => {
  useGetAllProjects(); // Fetch projects
  const { allProjects } = useSelector((store) => store.project);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [membersInfo, setMembersInfo] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState(null);

  const fetchMembersInfo = async () => {
    if (project && project.members) {
      try {
        const membersData = await Promise.all(
          project.members.map(async (member) => {
            const response = await axios.get(
              `${PROJECT_API_END_POINT}/users/${member.user}`,
              { withCredentials: true }
            );
            return {
              ...response.data.user,
              role: member.role,
            };
          })
        );
        setMembersInfo(membersData);
      } catch (error) {
        console.error("Error fetching member information:", error);
      }
    }
  };

  const fetchCreatorInfo = async () => {
    if (project && project.created_by) {
      try {
        const response = await axios.get(
          `${PROJECT_API_END_POINT}/users/${project.created_by}`,
          { withCredentials: true }
        );
        setCreatorInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    }
  };

  useEffect(() => {
    fetchMembersInfo();
    fetchCreatorInfo();
  }, [project]);

  const remainingMembers = membersInfo.length - 3;

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    return allProjects.filter((project) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "all" ||
        project.tags?.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
        );

      // Search filter
      const searchTerms = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        project.title?.toLowerCase().includes(searchTerms) ||
        project.description?.toLowerCase().includes(searchTerms) ||
        project.tags?.some((tag) => tag.toLowerCase().includes(searchTerms));

      return categoryMatch && searchMatch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          Discover Projects
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Find and collaborate on exciting projects across different categories
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Select defaultValue="all" onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No projects found matching your criteria
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              onClick={() => navigate(`/description/${project._id}`)}
              className="w-64 rounded-lg overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={`${project?.title || "Project"} Logo`}
                    className="h-20 w-full object-cover"
                  />
                ) : (
                  <div className="h-20 bg-blue-400" />
                )}
                <div className="absolute -bottom-6 left-4">
                  <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center shadow-md">
                    {creatorInfo?.profile?.profilePhoto ? (
                      <img
                        src={creatorInfo.profile.profilePhoto}
                        alt="Creator Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg mb-1 text-black ">
                    {project?.title}
                  </h2>
                  <div className=" right-2 flex items-center space-x-1">
                    <div className="flex -space-x-2 overflow-hidden">
                      {membersInfo.slice(0, 3).map((member, index) => (
                        <img
                          key={index}
                          className="inline-block h-5 w-5 rounded-full "
                          src={
                            member.profile?.profilePhoto ||
                            "/api/placeholder/32/32"
                          }
                          alt={`Member ${index + 1}`}
                        />
                      ))}
                    </div>
                    {remainingMembers > 0 && (
                      <Badge className="bg-white text-black text-xs font-medium ml-2">
                        +{remainingMembers}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {project?.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project?.requirements?.map((req, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      {req}
                    </Badge>
                  )) || (
                    <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      Sample Requirement
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
