import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { PROFESSIONS } from "@/data/professions";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Loader2,
  Github,
  Linkedin,
  Mail,
  Briefcase,
  MapPin,
} from "lucide-react";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Fetch all users
  useEffect(() => {
    // In Team.jsx, update the fetchUsers function
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${USER_API_END_POINT}/users/all`, {
          withCredentials: true, // Important for authentication
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

  // Handle profession filter
  const handleProfessionFilter = (profession) => {
    setSelectedProfession(profession);
    if (profession === "All") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.profession === profession);
      setFilteredUsers(filtered);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/user/${user._id}`, { state: { user } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Team Members
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-bold">
            Connect with talented professionals across different fields. Find
            the perfect teammate for your next project.
          </p>
        </div>
        {/* Profession Filters */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <span className="text-sm font-medium">
                    Show all professions
                  </span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>All Professions</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                  <span
                    onClick={() => handleProfessionFilter("All")}
                    className={`text-xl font-semibold cursor-pointer ${
                      selectedProfession === "All"
                        ? "text-primary"
                        : "text-gray-400 hover:text-gray-600"
                    } transition-colors duration-200`}
                  >
                    All
                  </span>
                  {PROFESSIONS.map((profession) => (
                    <span
                      key={profession}
                      onClick={() => handleProfessionFilter(profession)}
                      className={`text-xl font-semibold cursor-pointer ${
                        selectedProfession === profession
                          ? "text-primary"
                          : "text-gray-400 hover:text-gray-600"
                      } transition-colors duration-200`}
                    >
                      {profession}
                    </span>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Embla Carousel */}
          <div className="relative">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all
      ${
        !prevBtnEnabled
          ? "opacity-0 cursor-default"
          : "bg-white shadow-md hover:shadow-lg"
      }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              className="overflow-hidden mx-auto max-w-screen-lg"
              ref={emblaRef}
            >
              <div className="flex">
                <div className="flex-none min-w-[100px] px-2">
                  <span
                    onClick={() => handleProfessionFilter("All")}
                    className={`text-xl font-semibold cursor-pointer block text-center ${
                      selectedProfession === "All"
                        ? "text-primary"
                        : "text-gray-400 hover:text-gray-600"
                    } transition-colors duration-200`}
                  >
                    All
                  </span>
                </div>

                {PROFESSIONS.map((profession) => (
                  <div
                    key={profession}
                    className="flex-none min-w-[150px] px-2"
                  >
                    <span
                      onClick={() => handleProfessionFilter(profession)}
                      className={`text-xl font-semibold cursor-pointer block text-center ${
                        selectedProfession === profession
                          ? "text-primary"
                          : "text-gray-400 hover:text-gray-600"
                      } transition-colors duration-200`}
                    >
                      {profession}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all
      ${
        !nextBtnEnabled
          ? "opacity-0 cursor-default"
          : "bg-white shadow-md hover:shadow-lg"
      }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredUsers.length}{" "}
            {selectedProfession === "All"
              ? "team members"
              : selectedProfession + "s"}
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={user.profile?.profilePhoto || "/default-avatar.png"}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      user.status === "available"
                        ? "bg-green-500"
                        : user.status === "busy"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {user.username}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <p className="text-sm">{user.profession}</p>
                </div>

                {user.profile?.bio && (
                  <p className="text-gray-600 mt-3 text-center text-sm line-clamp-2">
                    {user.profile.bio}
                  </p>
                )}

                {/* Skills Section */}
                {user.profile?.skills && user.profile.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {user.profile.skills.slice(0, 3).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {user.profile.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.profile.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-4 pt-4 border-t flex justify-center gap-4">
                {user.profile?.socialLinks?.github && (
                  <a
                    href={user.profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {user.profile?.socialLinks?.linkedin && (
                  <a
                    href={user.profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                <a
                  href={`mailto:${user.email}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No team members found for {selectedProfession}.
            </p>
            <Button
              variant="ghost"
              onClick={() => handleProfessionFilter("All")}
              className="mt-4"
            >
              View all team members
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
