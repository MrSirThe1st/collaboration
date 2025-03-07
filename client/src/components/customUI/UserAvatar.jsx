import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getAvatarColor } from "@/utils/userUtils";

const UserAvatar = ({
  user,
  className = "",
  size = "default", 
  showStatus = false,
}) => {
  const initials = getInitials(user?.username);
  const bgColor = getAvatarColor(user?.username);

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={user?.profile?.profilePhoto} />
        <AvatarFallback
          style={{ backgroundColor: bgColor }}
          className="text-white font-medium"
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {showStatus && user?.status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${
              user.status === "available"
                ? "bg-green-500"
                : user.status === "busy"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
