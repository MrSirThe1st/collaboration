import { Input } from "./ui/input";
import { Search, Globe,X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { CATEGORIES } from "@/data/categories";

const SearchFilterSection = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  searchQuery,
  showAvailableOnly,
  onAvailabilityChange,
}) => {

  const handleCategoryChange = (value) => {
    const normalizedValue = value.toLowerCase().trim();
    onCategoryChange(normalizedValue);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center w-full gap-4 max-w-lg overflow-hidden ">
        <div className="w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm rounded-md border border-gray-300">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value.toLowerCase()}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center w-full max-w-md">
          <div className="relative flex-grow border border-border rounded-l-md">
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-3 bg-background"
              aria-label="Search projects"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="h-10 bg-primary text-primary-foreground px-3 rounded-r-md flex items-center justify-center"
            aria-label="Submit search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Availability Filter */}
        <Button
          variant={showAvailableOnly ? "default" : "outline"}
          onClick={onAvailabilityChange}
          className="h-9 px-4 shrink-0"
        >
          <Globe className="h-4 w-4 mr-2" />
          Available
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterSection;
