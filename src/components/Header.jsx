// src/components/Header.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Sync search state with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("q") || "";
    setQ(term);
  }, [location.search]);

  function submitSearch(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) navigate(`/?q=${encodeURIComponent(trimmed)}`);
    else navigate("/");
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3 gap-4">

        {/* Left: Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            P
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Pixisphere</div>
            <div className="text-xs text-gray-500">Find photographers</div>
          </div>
        </div>

        {/* Center: Search Bar (full width on mobile) */}
        <form
          onSubmit={submitSearch}
          className="flex-1 max-w-xl flex items-center"
        >
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search photographers, locations, tags…"
              className="input w-full pl-10 pr-3 py-2 text-sm"
            />
            {/* Search icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost text-sm"
          >
            Browse
          </button>

          <button className="btn btn-primary text-sm">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
