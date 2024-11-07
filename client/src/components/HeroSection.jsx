import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { FILTER_CATEGORIES } from "@/data/categories";

const CATEGORIES = [
  { value: "View All", label: "View All" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Data Science", label: "Data Science" },
];

const SearchFilterSection = ({ onCategoryChange, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (newValue) => {
    if (onCategoryChange) {
      onCategoryChange(newValue.toLowerCase()); // Convert to lowercase to match your filter logic
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="w-full flex items-center mb-4">
      <div className="flex flex-col sm:flex-row w-full max-w-lg shadow-md rounded-md overflow-hidden">
        <Select defaultValue="all" onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm rounded-t-md sm:rounded-l-md sm:rounded-tr-none border-b sm:border-b-0 sm:border-r">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_CATEGORIES.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value.toLowerCase()}
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full h-9 text-sm pl-7 rounded-none border-b sm:border-b-0 sm:border-r focus:ring-0 focus:border-gray-300"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilterSection;
