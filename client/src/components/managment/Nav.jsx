import React from "react";
import { Button } from "../ui/button";

const tabs = [
  { name: "Mail", href: "#mail" },
  { name: "Dashboard", href: "#dashboard" },
  { name: "Cards", href: "#cards" },
  { name: "Tasks", href: "#tasks" },
  { name: "Playground", href: "#playground" },
  { name: "Forms", href: "#forms" },
  { name: "Music", href: "#music" },
  { name: "Authentication", href: "#authentication" },
];

const Nav = () => {
  return (
    <header className="bg-gray-900 text-white p-4">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            as="a"
            href={tab.href}
            variant="ghost"
            className="text-sm hover:text-gray-300"
          >
            {tab.name}
          </Button>
        ))}
      </nav>
    </header>
  );
};

export default Nav;
