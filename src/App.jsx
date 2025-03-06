import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ChartBarIcon as DashboardIcon, UserGroupIcon as PeopleIcon, CogIcon as SettingsIcon } from "@heroicons/react/outline";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon className="w-6 h-6" />, path: "/dashboardAdmin" },
  { text: "Users", icon: <PeopleIcon className="w-6 h-6" />, path: "/Users" },
  { text: "Settings", icon: <SettingsIcon className="w-6 h-6" />, path: "/settings" },
];

function Navbar({ className, children }) {
  return (
    <nav className={className}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </nav>
  );
}

function Sidebar({ className, children }) {
  return (
    <aside className={className}>
      {children}
    </aside>
  );
}

function App() {
  return (
    <div className="flex">
      <Navbar className="fixed w-full z-10 bg-primary">
        <h1 className="text-white text-xl">Admin Dashboard</h1>
      </Navbar>

      <Sidebar className="w-60">
        <div className="mt-16">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-200">
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </Sidebar>

      <main className="flex-grow p-4 mt-16 ml-60">
        <Outlet />
      </main>
    </div>
  );
}

export default App;