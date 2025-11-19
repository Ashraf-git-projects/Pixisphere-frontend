// src/pages/CategoryPage.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchPhotographers } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

/** escape string for use in RegExp */
function escapeRegExp(string = "") {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** highlight matched search text */
function renderHighlighted(text = "", q = "") {
  if (!q) return text;
  const pattern = new RegExp(escapeRegExp(q), "gi");
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push(
      <mark
        key={key++}
        className="bg-yellow-200 px-0.5 rounded-sm"
      >
        {match[0]}
      </mark>
    );
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : text;
}

function fuzzyMatch(text = "", q = "") {
  if (!q) return true;
  text = (text || "").toLowerCase();
  q = q.toLowerCase().trim();
  if (text.includes(q)) return true;
  let i = 0;
  for (let ch of text) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

/* ---------------------- FiltersSidebar ---------------------- */
function FiltersSidebar({ allItems, filters, setFilters, onClear }) {
  const styles = useMemo(() => {
    const s = new Set();
    (allItems || []).forEach((p) => (p.styles || []).forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [allItems]);

  const locations = useMemo(() => {
    const s = new Set();
    (allItems || []).forEach((p) => s.add(p.location));
    return Array.from(s).sort();
  }, [allItems]);

  const updateMin = (v) =>
    setFilters((f) => ({ ...f, priceMin: Number(v || 0) }));
  const updateMax = (v) =>
    setFilters((f) => ({ ...f, priceMax: v ? Number(v) : null }));

  const toggleStyle = (style) =>
    setFilters((f) => {
      const setStyles = new Set(f.styles || []);
      if (setStyles.has(style)) setStyles.delete(style);
      else setStyles.add(style);
      return { ...f, styles: Array.from(setStyles) };
    });

  const toggleRating = (val) =>
    setFilters((f) => {
      const setR = new Set(f.ratings || []);
      if (setR.has(val)) setR.delete(val);
      else setR.add(val);
      return { ...f, ratings: Array.from(setR) };
    });

  return (
    <aside className="card lift p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      {/* Location */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Location
        </label>
        <select
          value={filters.location || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              location: e.target.value || null,
            }))
          }
          className="mt-2 input"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option value={loc} key={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Price (₹)
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) => updateMin(e.target.value)}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) => updateMax(e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Rating
        </label>
        <div className="mt-2 space-y-2 text-sm">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(filters.ratings || []).includes(r)}
                onChange={() => toggleRating(r)}
              />
              <span>{r}★ & up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Styles */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Styles
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {styles.length === 0 ? (
            <div className="text-sm text-gray-500">No styles</div>
          ) : (
            styles.map((s) => {
              const active = (filters.styles || []).includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStyle(s)}
                  className={`badge ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : ""
                  }`}
                >
                  {s}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onClear}
          className="btn btn-ghost w-full text-sm"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}

/* ---------------------- PhotographerCard ---------------------- */
function PhotographerCard({ p, query }) {
  const navigate = useNavigate();
  return (
    <div className="card bg-white hover:shadow-lg transition-shadow duration-150 cursor-pointer">
      <div
        className="h-40 bg-gray-100 overflow-hidden"
        onClick={() => navigate(`/photographer/${p.id}`)}
      >
        <img
          src={p.profilePic || "https://placehold.co/300x200"}
          alt={p.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="card-inner">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="text-base font-semibold leading-tight"
              onClick={() => navigate(`/photographer/${p.id}`)}
            >
              {renderHighlighted(p.name || "", query)}
            </h3>
            <p className="text-xs mt-1 text-gray-500">{p.location}</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-semibold text-gray-800">
              ₹{p.price.toLocaleString("en-IN")}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-amber-600 font-medium">
              <span>{p.rating}</span>
              <span>★</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700 two-line-truncate">
          {renderHighlighted(p.bio || "", query)}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {p.tags?.slice(0, 3).map((t, i) => (
              <span key={i} className="badge">
                {t}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(`/photographer/${p.id}`)}
            className="btn btn-primary text-xs"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Main CategoryPage ---------------------- */
export default function CategoryPage() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const qParam = new URLSearchParams(location.search).get("q") || "";

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: null,
    ratings: [],
    styles: [],
    location: null,
  });

  const [sortOption, setSortOption] = useState("default");

  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const debounceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchPhotographers()
      .then((data) => {
        setAllItems(data || []);
        setItems(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("fetch error", err);
        setError("Failed to load photographers.");
      })
      .finally(() => setLoading(false));
  }, []);

  const applyAllFilters = () => {
    const q = String(qParam || "").trim();

    return (allItems || []).filter((p) => {
      if (q) {
        const matched =
          fuzzyMatch(p.name, q) ||
          fuzzyMatch(p.location, q) ||
          fuzzyMatch((p.tags || []).join(" "), q) ||
          fuzzyMatch((p.styles || []).join(" "), q) ||
          fuzzyMatch(p.bio, q);
        if (!matched) return false;
      }

      if (filters.location) {
        if ((p.location || "") !== filters.location) return false;
      }

      if (typeof filters.priceMin === "number" && filters.priceMin > 0) {
        if ((p.price || 0) < filters.priceMin) return false;
      }
      if (filters.priceMax) {
        if ((p.price || 0) > filters.priceMax) return false;
      }

      if (filters.ratings && filters.ratings.length > 0) {
        const ok = filters.ratings.some((r) => (p.rating || 0) >= r);
        if (!ok) return false;
      }

      if (filters.styles && filters.styles.length > 0) {
        const has = filters.styles.some((s) => (p.styles || []).includes(s));
        if (!has) return false;
      }

      return true;
    });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      let result = applyAllFilters();

      const sorted = [...result];
      if (sortOption === "price_asc") {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortOption === "rating_desc") {
        sorted.sort((a, b) => {
          const ra = Number(a?.rating ?? 0);
          const rb = Number(b?.rating ?? 0);
          return rb - ra;
        });
      } else if (sortOption === "recent") {
        sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
      }

      setItems(sorted);
      setVisibleCount(PAGE_SIZE);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [qParam, allItems, filters, sortOption]);

  const clearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: null,
      ratings: [],
      styles: [],
      location: null,
    });
  };

  const handleLoadMore = () => {
    setVisibleCount((v) => Math.min(items.length, v + PAGE_SIZE));
  };

  return (
    <div className="min-h-screen py-6">
      <div className="container flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-72 w-full md:flex-shrink-0">
          <FiltersSidebar
            allItems={allItems}
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="page-title">Photographers</h1>
              <p className="text-sm text-gray-500 mt-1">
                {loading
                  ? "Loading results…"
                  : `${items.length} result${
                      items.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="input max-w-[180px] py-1"
              >
                <option value="default">Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="rating_desc">Rating: High → Low</option>
                <option value="recent">Recently added</option>
              </select>
            </div>
          </header>

          {loading ? (
            <div className="grid-cols-responsive">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card h-56 bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="card p-4 text-red-700 bg-red-50 border border-red-100">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="card p-6 text-gray-600">
              No photographers found for "<strong>{qParam}</strong>"
            </div>
          ) : (
            <>
              <div className="grid-cols-responsive">
                {items.slice(0, visibleCount).map((p) => (
                  <PhotographerCard key={p.id} p={p} query={qParam} />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                {visibleCount < items.length ? (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="btn btn-primary text-sm"
                  >
                    Load more
                  </button>
                ) : (
                  <div className="text-xs text-gray-500">
                    No more results
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
