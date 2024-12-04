import React from "react";
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

const SearchFilterSection = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  searchQuery,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto  mb-8">
      <div className="flex flex-col sm:flex-row items-center w-full gap-4 max-w-lg  overflow-hidden p-4 ">
        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm rounded-md border border-gray-300">
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
        </div>

        {/* Search Bar */}
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full h-9 text-sm pl-10 rounded-md border border-gray-300 focus:ring-0 focus:border-gray-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilterSection;
