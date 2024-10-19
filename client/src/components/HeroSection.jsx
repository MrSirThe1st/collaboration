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

const SearchFilterSection = () => {
  const [category, setCategory] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [country, setCountry] = useState("");

  return (
    <div className="w-full flex  items-center mb-4">
      <div className="flex flex-col sm:flex-row w-full max-w-lg shadow-md rounded-md overflow-hidden">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[110px] h-9 text-sm rounded-t-md sm:rounded-l-md sm:rounded-tr-none border-b sm:border-b-0 sm:border-r">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">home</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="design">UI/UX Design</SelectItem>
            <SelectItem value="data">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-grow ">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by keyword or URL"
            className="w-full h-9 text-sm pl-7 rounded-none border-b sm:border-b-0 sm:border-r focus:ring-0 focus:border-gray-300"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
        {/* <Input
          type="text"
          placeholder="Country"
          className="w-full sm:w-[120px] h-9 text-sm rounded-b-md sm:rounded-r-md sm:rounded-bl-none focus:ring-0 focus:border-gray-300"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        /> */}
      </div>
    </div>
  );
};

export default SearchFilterSection;