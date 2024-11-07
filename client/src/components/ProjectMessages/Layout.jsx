import React from "react";


// Main Layout Component
const Layout = ({ children, project }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChannelsList project={project} />
      <main className="flex-1 flex flex-col min-w-0">
        <ProjectHeader project={project} />
        {children}
      </main>
      <ProjectInfo project={project} />
    </div>
  );
};

export default Layout;
