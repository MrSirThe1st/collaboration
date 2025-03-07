import { useState, useEffect } from "react";
import Sidebar from "./shared/SideBar";
import NotificationBell from "./ProjectMessages/components/NotificationBell";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Add responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Listen for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main content area with proper mobile support */}
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{
          marginLeft: isMobile ? 0 : "var(--sidebar-width, 240px)",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Mobile header spacer */}
        {isMobile && <div className="h-16" />}

        {/* Notification bell placement */}
        <div
          className={
            isMobile ? "fixed top-3 right-4 z-50" : "fixed top-4 right-4 z-50"
          }
        >
          <NotificationBell />
        </div>

        {/* Main content with proper overflow handling */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
