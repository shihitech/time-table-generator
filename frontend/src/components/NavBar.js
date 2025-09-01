import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-purple-600 text-white"
        : "text-gray-700 hover:bg-purple-200"
    }`;

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow">
      <h1 className="text-lg font-bold text-purple-700">School Timetable</h1>
      <div className="space-x-4">
        <Link to="/" className={linkClasses("/")}>Upload</Link>
        <Link to="/timetable" className={linkClasses("/timetable")}>Timetable</Link>
      </div>
    </nav>
  );
}
