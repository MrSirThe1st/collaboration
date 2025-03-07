import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
} from "lucide-react";
import { PROFESSIONS } from "@/data/professions";
import CountrySelect from "../ProjectMessages/components/CountrySelect";
import { ScrollArea } from "@/components/ui/scroll-area";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profession: "",
    file: null,
    country: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const { loading, user } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter professions based on search query
  const filteredProfessions = searchQuery
    ? PROFESSIONS.filter((profession) =>
        profession.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PROFESSIONS;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  }, [isDropdownOpen]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        // Set the file in state
        setFormData({ ...formData, file });

        // Create and set the preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Log to confirm the URL is created
        console.log("Preview URL created:", url);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleProfessionSelect = (profession) => {
    setFormData({ ...formData, profession });
    setIsDropdownOpen(false);
    // We don't clear the search query here so it remembers the last search
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    // Clear search when opening dropdown
    if (!isDropdownOpen) {
      setSearchQuery("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      dispatch(setLoading(true));
      const signupRes = await axios.post(
        `${USER_API_END_POINT}/register`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (signupRes.data.success) {
        // Auto login after successful signup
        const loginRes = await axios.post(
          `${USER_API_END_POINT}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (loginRes.data.success) {
          dispatch(setUser(loginRes.data.user));
          navigate("/");
          toast.success("Account created and logged in successfully");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-sm md:max-w-lg">
        <CardHeader className="space-y-2 sm:space-y-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Enter your information to create your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Profile Image Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/20 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4 text-primary-foreground" />
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    className="pl-9"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-9"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-9"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2" ref={dropdownRef}>
                <Label htmlFor="profession">Profession</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full p-2 flex items-center justify-between border rounded-md bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  >
                    <span className="truncate">
                      {formData.profession || "Select your profession"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute mt-1 w-full rounded-md border bg-popover shadow-md z-10">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            ref={searchInputRef}
                            placeholder="Search professions..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <ScrollArea className="h-60 py-1">
                        {filteredProfessions.length > 0 ? (
                          filteredProfessions.map((profession) => (
                            <div
                              key={profession}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent ${
                                formData.profession === profession
                                  ? "bg-accent/50"
                                  : ""
                              }`}
                              onClick={() => handleProfessionSelect(profession)}
                            >
                              {profession}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                            No professions found
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="profession"
                  value={formData.profession || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <CountrySelect
                  value={formData.country}
                  onChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 sm:space-y-4 items-center">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
