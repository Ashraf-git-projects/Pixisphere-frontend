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
    <header className="site-header">
      <div className="container site-header-inner">
        {/* Brand */}
        <div
          className="site-brand"
          onClick={() => navigate("/")}
        >
          <div className="site-brand-logo">P</div>
          <div>
            <div className="site-brand-title">Pixisphere</div>
            <div className="site-brand-subtitle">Find photographers</div>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={submitSearch}
          className="site-header-center"
        >
          <div className="site-search-wrapper">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search photographers, locations, tags…"
              className="site-search-input"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="site-search-icon"
              viewBox="0 0 24 24"
              fill="none"
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

        {/* Right actions */}
        <div className="site-header-actions">
          <button
            type="button"
            className="btn btn-ghost text-sm"
            onClick={() => navigate("/")}
          >
            Browse
          </button>
          <button
            type="button"
            className="btn btn-primary text-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
