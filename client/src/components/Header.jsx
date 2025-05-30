import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-[#18191B] border-b border-[#232326] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          to="/problems"
          className="text-lg font-semibold text-white hover:text-blue-400 transition"
        >
          Problems
        </Link>
      </div>
      <div>
        <Link
          to="/dashboard"
          className="text-white px-4 py-2 rounded hover:bg-[#23272f] transition"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}