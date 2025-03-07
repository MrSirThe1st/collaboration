import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { PROFESSIONS } from "@/data/professions";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Check,
  Search,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "./customUI/UserAvatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Github, Linkedin, Mail, Briefcase } from "lucide-react";
import Flag from "react-world-flags";
import TeamSkeleton from "./TeamSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(16); // 4 columns × 4 rows = 16 users per page
  const [totalPages, setTotalPages] = useState(1);

  const countries = useMemo(() => {
    const countryMap = new Map();
    countryMap.set("All", { code: "All", name: "All Countries" });

    users.forEach((user) => {
      if (user.profile?.country) {
        const { code, name } = user.profile.country;
        countryMap.set(code, { code, name });
      }
    });

    return Array.from(countryMap.values());
  }, [users]);

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // Adjust users per page based on screen size
      if (window.innerWidth < 640) {
        setUsersPerPage(8); // 1 column × 8 rows for small mobile
      } else if (window.innerWidth < 1024) {
        setUsersPerPage(12); // 2-3 columns for tablets
      } else {
        setUsersPerPage(16); // 4 columns for desktop
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate pagination info
  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));

    // Reset to first page when filters change
    if (currentPage > Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredUsers, usersPerPage]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${USER_API_END_POINT}/users/all`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters when profession or country changes
  const applyFilters = (profession, country) => {
    setFilteredUsers(
      users.filter((user) => {
        const matchesProfession =
          profession === "All" || user.profession === profession;
        const matchesCountry =
          country === "All" || user.profile?.country?.code === country;

        return matchesProfession && matchesCountry;
      })
    );

    // Reset to page 1 when applying filters
    setCurrentPage(1);
  };

  const handleFilter = (profession, country) => {
    setSelectedProfession(profession || selectedProfession);
    setSelectedCountry(country || selectedCountry);
    applyFilters(profession || selectedProfession, country || selectedCountry);
  };

  const clearFilters = () => {
    setSelectedProfession("All");
    setSelectedCountry("All");
    setSearchInput("");
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  const handleUserClick = (user) => {
    navigate(`/user/${user._id}`, { state: { user } });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission

    if (!searchInput.trim()) {
      // If search is empty, just apply current filters
      applyFilters(selectedProfession, selectedCountry);
      return;
    }

    // Filter users based on username and current filters
    const searchResults = users.filter((user) => {
      // Check if the username includes the search term
      const matchesUsername = user.username
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      // Also check against current filters
      const matchesProfession =
        selectedProfession === "All" || user.profession === selectedProfession;
      const matchesCountry =
        selectedCountry === "All" ||
        user.profile?.country?.code === selectedCountry;

      return matchesUsername && matchesProfession && matchesCountry;
    });

    setFilteredUsers(searchResults);
    setCurrentPage(1); // Reset to first page after search
  };

  // Handle search input clearing
  const clearSearch = () => {
    setSearchInput("");
    applyFilters(selectedProfession, selectedCountry);
  };

  // Get current users for pagination
  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the grid
      window.scrollTo({
        top: document.getElementById("team-grid")?.offsetTop - 100 || 0,
        behavior: "smooth",
      });
    }
  };

  // Create page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed before current page range
    if (startPage > 2) {
      pageNumbers.push("ellipsis-start");
    }

    // Add page numbers around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed after current page range
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (isLoading) {
    return <TeamSkeleton />;
  }

  const currentUsers = getCurrentUsers();
  const pageNumbers = getPageNumbers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center w-full max-w-md"
            >
              <div className="relative flex-grow border border-border rounded-l-md">
                <Input
                  placeholder="Search by username"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-3 bg-background"
                  aria-label="Search members"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
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
            </form>

            {/* Combined filter button for mobile */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 sm:w-auto"
                  aria-label="Open filters"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {(selectedProfession !== "All" ||
                    selectedCountry !== "All") && (
                    <Badge className="ml-1 bg-primary text-primary-foreground">
                      {selectedProfession !== "All" && selectedCountry !== "All"
                        ? 2
                        : 1}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Profession filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Profession</h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                      {["All", ...PROFESSIONS].map((profession) => (
                        <button
                          key={profession}
                          onClick={() =>
                            handleFilter(profession, selectedCountry)
                          }
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent text-left",
                            selectedProfession === profession
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground"
                          )}
                        >
                          <span>{profession}</span>
                          {selectedProfession === profession && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Country</h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() =>
                            handleFilter(selectedProfession, country.code)
                          }
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent",
                            selectedCountry === country.code
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {country.code !== "All" && (
                              <Flag code={country.code} className="w-5 h-4" />
                            )}
                            <span>{country.name}</span>
                          </div>
                          {selectedCountry === country.code && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter>
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                    >
                      Clear filters
                    </Button>
                    <SheetClose asChild>
                      <Button className="flex-1">Apply</Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active filter indicators */}
        {(selectedProfession !== "All" || selectedCountry !== "All") && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedProfession !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {selectedProfession}
                <button onClick={() => handleFilter("All", selectedCountry)}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}
            {selectedCountry !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {countries.find((c) => c.code === selectedCountry)?.name}
                <button onClick={() => handleFilter(selectedProfession, "All")}>
                  <X className="h-3 w-3 ml-1" />
                </button>
              </Badge>
            )}
            {(selectedProfession !== "All" || selectedCountry !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      {/* User cards grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchInput
              ? `No users found matching "${searchInput}"`
              : "No members match your filters"}
          </p>
        </div>
      ) : (
        <>
          <div
            id="team-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {currentUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="rounded-xl shadow-sm hover:shadow-md p-3 md:p-4 cursor-pointer 
           transition-all duration-300 hover:scale-[1.02] border bg-background"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <UserAvatar
                      user={user}
                      className="w-12 h-12 md:w-16 md:h-16"
                      showStatus
                    />
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-center">
                    {user.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {user.profession}
                    </p>
                  </div>

                  {/* Country badge when available */}
                  {user.profile?.country && (
                    <div className="flex items-center gap-1 mt-1">
                      <Flag
                        code={user.profile.country.code}
                        className="w-4 h-3"
                      />
                      <span className="text-xs text-muted-foreground">
                        {user.profile.country.name}
                      </span>
                    </div>
                  )}

                  <div className="mt-2 text-center text-xs text-muted-foreground h-12 overflow-hidden">
                    {user.profile?.bio || "\u00A0"}{" "}
                  </div>

                  {user.profile?.skills && user.profile.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {user.profile.skills
                        .slice(0, isMobile ? 2 : 3)
                        .map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      {user.profile.skills.length > (isMobile ? 2 : 3) && (
                        <Badge variant="outline" className="text-xs">
                          +{user.profile.skills.length - (isMobile ? 2 : 3)}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t flex justify-center gap-2 w-full">
                    {user.profile?.socialLinks?.github && (
                      <a
                        href={user.profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {user.profile?.socialLinks?.linkedin && (
                      <a
                        href={user.profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((pageNumber, index) =>
                  pageNumber === "ellipsis-start" ||
                  pageNumber === "ellipsis-end" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

  
      {/* {filteredUsers.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {currentUsers.length} of {filteredUsers.length} members
            {filteredUsers.length < users.length
              ? ` (filtered from ${users.length})`
              : ""}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default Team;
