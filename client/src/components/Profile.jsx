import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Mail, Edit, Github, Linkedin, Globe } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import Flag from "react-world-flags";
import UserAvatar from "./customUI/UserAvatar";
import Footer from "./shared/Footer";
import { useDispatch } from "react-redux";
import axios from "axios";

const Profile = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${USER_API_END_POINT}/delete-account`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setUser(null));
        toast.success("Account deleted successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  // Protected against missing user data with fallbacks
  const skills = user?.profile?.skills || [];
  const github = user?.profile?.socialLinks?.github || "";
  const linkedin = user?.profile?.socialLinks?.linkedin || "";
  const portfolio = user?.profile?.socialLinks?.portfolio || "";
  const country = user?.profile?.country;
  const bio = user?.profile?.bio || "No bio provided yet";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header section */}
      

      {/* Main content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <Link to="/profile/edit">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          </Link>
        </div>
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {/* Cover photo area with gradient */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
            <div className="absolute -bottom-12 left-8">
              <UserAvatar
                user={user}
                className="w-24 h-24 border-4 border-background"
                size="lg"
                showStatus
              />
            </div>
          </div>

          {/* Profile details */}
          <div className="pt-16 pb-6 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <p className="text-muted-foreground">
                  {user?.profession || "No profession listed"}
                </p>
              </div>

              {/* Country badge if available */}
              {country && (
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <Flag code={country.code} className="h-4 w-6 object-cover" />
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
              )}
            </div>

            {/* Bio section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">About</h3>
              <div className="bg-muted/50 rounded-lg p-4 text-sm md:text-base">
                {bio}
              </div>
            </div>

            {/* Contact information */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Contact</h3>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No skills added yet
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Social Links</h3>
              <div className="flex flex-wrap gap-4">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                )}

                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Portfolio</span>
                  </a>
                )}

                {!github && !linkedin && !portfolio && (
                  <p className="text-muted-foreground text-sm">
                    No social links added
                  </p>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-10 pt-6 border-t border-border">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Once you delete your account, there is no going back. This
                  action is permanent.
                </p>

                <AlertDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Delete Account"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and all your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
