import React from "react";
import Sidebar from "./shared/SideBar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-background text-foreground">
        {children}
      </main>
    </div>
  );
};

export default Layout;
