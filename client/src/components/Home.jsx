import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useGetAllProjects from "@/hooks/useGetAllProjects";
import SearchFilterSection from "./SearchFilterSection";
import LatestProjects from "./LatestProjects";

const Home = () => {
  useGetAllProjects();
  const { allProjects } = useSelector((store) => store.project);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    return allProjects.filter((project) => {
      // Category filter - check both category and tags
      const categoryMatch =
        selectedCategory === "all" ||
        project.category?.toLowerCase() === selectedCategory ||
        project.tags?.some((tag) => tag.toLowerCase() === selectedCategory);

      // Search filter - check title, description, and tags
      const searchTerms = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        [
          project.title,
          project.description,
          ...(project.tags || []),
          ...(project.requirements || []),
        ].some((field) => field?.toLowerCase().includes(searchTerms));

      return categoryMatch && searchMatch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen ">
      <div className="py-8">
        <SearchFilterSection
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
        <LatestProjects projects={filteredProjects} />
      </div>
    </div>
  );
};

export default Home;
