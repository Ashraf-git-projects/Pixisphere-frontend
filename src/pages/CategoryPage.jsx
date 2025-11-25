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
      <mark key={key++} className="bg-yellow-200 px-0.5 rounded-sm">
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
    <aside className="card lift filters-card">
      <h3 className="filters-title">Filters</h3>

      {/* Location */}
      <div className="filters-group">
        <label className="filters-label">Location</label>
        <div className="filters-row">
          <select
            value={filters.location || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                location: e.target.value || null,
              }))
            }
            className="input"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option value={loc} key={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="filters-group">
        <label className="filters-label">Price (₹)</label>
        <div className="filters-row" style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) => updateMin(e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) => updateMax(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="filters-group">
        <label className="filters-label">Rating</label>
        <div className="filters-row" style={{ fontSize: "0.85rem" }}>
          {[4, 3, 2].map((r) => (
            <label
              key={r}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <input
                type="checkbox"
                checked={(filters.ratings || []).includes(r)}
                onChange={() => toggleRating(r)}
              />
              <span>{r}★ &amp; up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Styles */}
      <div className="filters-group">
        <label className="filters-label">Styles</label>
        <div className="filters-row" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {styles.length === 0 ? (
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              No styles
            </div>
          ) : (
            styles.map((s) => {
              const active = (filters.styles || []).includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStyle(s)}
                  className={`badge ${
                    active ? "bg-blue-600 text-white border-blue-600" : ""
                  }`}
                >
                  {s}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <button
          type="button"
          onClick={onClear}
          className="btn btn-ghost"
          style={{ width: "100%", fontSize: "0.8rem" }}
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

  const id = p._id ?? p.id;
  const displayName =
    p.name || p.businessName || p.user?.name || "Photographer";
  const location = p.location || p.city || "";
  const rating = p.rating ?? null;
  const priceValue = p.price ?? p.priceFrom ?? p.priceTo ?? null;

  const priceLabel =
    priceValue != null
      ? `₹${priceValue.toLocaleString("en-IN")}`
      : "Price on request";

  const profilePic =
    p.profilePic ||
    p.portfolio?.[0]?.url ||
    p.portfolio?.[0] ||
    "https://placehold.co/300x200?text=Pixisphere";

  return (
    <div
      className="card bg-white cursor-pointer"
      onClick={() => navigate(`/photographer/${id}`)}
    >
      <div className="card-image-top">
        <img
          src={profilePic}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="card-inner card-inner--photographer">
        {/* top row: title + price/rating */}
        <div className="card-inner--photographer-top">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight">
              {renderHighlighted(displayName, query)}
            </h3>
            {location && (
              <p className="card-inner--photographer-meta">{location}</p>
            )}
          </div>

          <div style={{ textAlign: "right", fontSize: "0.8rem" }}>
            <div className="font-semibold text-gray-800">{priceLabel}</div>
            <div
              style={{
                marginTop: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.2rem",
                color: "#b45309",
                fontWeight: 500,
              }}
            >
              {rating != null ? (
                <>
                  <span>{Number(rating).toFixed(1)}</span>
                  <span>★</span>
                </>
              ) : (
                <span style={{ color: "#9ca3af" }}>No rating</span>
              )}
            </div>
          </div>
        </div>

        {/* bio */}
        <p className="card-inner--photographer-body two-line-truncate">
          {renderHighlighted(p.bio || "", query)}
        </p>

        {/* footer: tags + button pinned to bottom */}
        <div className="card-inner--photographer-footer">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {p.tags?.slice(0, 3).map((t, i) => (
              <span key={i} className="badge">
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary text-xs"
            onClick={(e) => {
              e.stopPropagation(); // so card onClick doesn’t fire twice
              navigate(`/photographer/${id}`);
            }}
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

  const locationHook = useLocation();
  const qParam = new URLSearchParams(locationHook.search).get("q") || "";

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
    <div className="page-shell">
      <div className="container">
        <div className="layout-main">
          {/* Sidebar */}
          <div className="layout-sidebar">
            <FiltersSidebar
              allItems={allItems}
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
            />
          </div>

          {/* Main content */}
          <div className="layout-content">
            <header className="section-header">
              <div>
                <h1 className="page-title">Photographers</h1>
                <p className="results-meta">
  {loading
    ? "Loading results…"
    : `${items.length} result${
        items.length !== 1 ? "s" : ""
      } found`}
</p>

              </div>

              <div className="sort-controls">
                <span>Sort by</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="input"
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
                    className="card"
                    style={{
                      height: "220px",
                      background: "#f3f4f6",
                      animation: "pulse 1.3s ease-in-out infinite",
                    }}
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
                    <PhotographerCard
                      key={p._id || p.id}
                      p={p}
                      query={qParam}
                    />
                  ))}
                </div>

                <div className="results-footer">
  {visibleCount < items.length ? (
    <button
      type="button"
      onClick={handleLoadMore}
      className="btn btn-primary text-sm"
    >
      Load more
    </button>
  ) : (
    <div>No more results</div>
  )}
</div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
