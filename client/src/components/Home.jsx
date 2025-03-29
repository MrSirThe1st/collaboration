import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetAllProjects from "@/hooks/useGetAllProjects";
import SearchFilterSection from "./SearchFilterSection";
import LatestProjects from "./LatestProjects";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"; // Import Pagination components

// Constants for pagination
const ITEMS_PER_PAGE = 12;

const Home = () => {
  useGetAllProjects();
  const { allProjects, loading: projectsLoading } = useSelector(
    (store) => store.project
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const PROFILE_REMINDER_KEY = "profile_reminder_dismissed";
  const REMINDER_DELAY_DAYS = 3;

  // State for profile completion dialog
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const handleAvailabilityFilter = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };

  // Profile completion check
  const isProfileComplete = useMemo(
    () => (user) => {
      return Boolean(
        user.profile?.skills?.length > 0 && user.profile?.country?.code
      );
    },
    []
  );

  // Filter projects - Memoized for performance
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    return allProjects.filter((project) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "all" ||
        project.category?.toLowerCase() === selectedCategory ||
        project.tags?.some((tag) => tag.toLowerCase() === selectedCategory);

      // Search filter
      const searchTerms = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        [
          project.title,
          project.description,
          ...(project.tags || []),
          ...(project.requirements || []),
        ].some((field) => field?.toLowerCase().includes(searchTerms));

      // Region availability filter
      const regionMatch =
        !showAvailableOnly ||
        project.countryRestriction.isGlobal ||
        project.countryRestriction.country.code ===
          user?.profile?.country?.code;

      // Apply all filters
      return categoryMatch && searchMatch && regionMatch;
    });
  }, [allProjects, selectedCategory, searchQuery, showAvailableOnly, user]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  }, [filteredProjects]);

  // Get current page projects
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, showAvailableOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && !isProfileComplete(user)) {
        const lastDismissed = localStorage.getItem(PROFILE_REMINDER_KEY);

        if (lastDismissed) {
          const dismissDate = new Date(parseInt(lastDismissed));
          const currentDate = new Date();
          const daysSinceDismiss = Math.floor(
            (currentDate - dismissDate) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceDismiss >= REMINDER_DELAY_DAYS) {
            setShowProfileDialog(true);
          }
        } else {
          setShowProfileDialog(true);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isProfileComplete]);

  const handleRemindLater = () => {
    localStorage.setItem(PROFILE_REMINDER_KEY, Date.now().toString());
    setShowProfileDialog(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem(PROFILE_REMINDER_KEY, "never");
    setShowProfileDialog(false);
  };

  const handleCompleteProfile = () => {
    setShowProfileDialog(false);
    navigate("/profile/edit");
  };

  const generatePaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [1];

    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(totalPages - 1, currentPage + 1);

    if (windowStart > 2) {
      pages.push("...");
    }

    for (let i = windowStart; i <= windowEnd; i++) {
      pages.push(i);
    }

    if (windowEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 my-4">
      <SearchFilterSection
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        showAvailableOnly={showAvailableOnly}
        onAvailabilityChange={handleAvailabilityFilter}
      />

      <LatestProjects projects={currentProjects} isLoading={projectsLoading} />

      {/* Pagination UI */}
      {filteredProjects.length > 0 && (
        <div className="mt-8 flex flex-col items-center">
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {generatePaginationItems().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() =>
                        typeof page === "number" && setCurrentPage(page)
                      }
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next page button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Profile Completion Alert Dialog */}
      <AlertDialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-5 w-5 text-primary" />
              Complete Your Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm sm:text-base">
              <p>Adding more information such as your skills will help you:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Get matched with the right projects</li>
                <li>Connect with team members who share your skills</li>
                <li>Showcase your expertise to potential collaborators</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <AlertDialogCancel
                onClick={handleRemindLater}
                className="w-full sm:w-auto py-2.5 text-sm"
              >
                Remind Me Later
              </AlertDialogCancel>
              <Button
                variant="ghost"
                onClick={handleDontShowAgain}
                className="text-muted-foreground text-xs sm:text-sm w-full sm:w-auto"
              >
                Don't Show Again
              </Button>
            </div>
            <AlertDialogAction
              onClick={handleCompleteProfile}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto py-2.5 text-sm"
            >
              Complete Profile Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;
