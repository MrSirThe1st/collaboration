import React from "react";
import SidebarWorkspace from "./shared/SideBarWorkspace";

const Layout2 = ({ children }) => {
  return (
    <div className="flex">
      <SidebarWorkspace />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout2;
