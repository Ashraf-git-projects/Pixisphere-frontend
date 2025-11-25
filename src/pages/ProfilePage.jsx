// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPhotographerById } from "../api/api";

/**
 * Simple modal with overlay
 */
function Modal({ open, onClose, children }) {
  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
    backdropFilter: "blur(4px)",
  };

  const panelStyle = {
    position: "relative",
    background: "#ffffff",
    borderRadius: "0.9rem",
    width: "100%",
    maxWidth: "720px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 18px 45px rgba(15,23,42,0.35)",
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div className="card-inner">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  if (!message) return null;

  const toastStyle = {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    background: "#16a34a",
    color: "white",
    padding: "0.6rem 0.9rem",
    borderRadius: "0.75rem",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    zIndex: 60,
    boxShadow: "0 14px 30px rgba(22,163,74,0.45)",
  };

  return (
    <div style={toastStyle}>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          color: "white",
          cursor: "pointer",
          fontSize: "0.7rem",
          textDecoration: "underline",
        }}
      >
        Dismiss
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  // inquiry modal
  const [modalOpen, setModalOpen] = useState(false);

  // form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchPhotographerById(id)
      .then((data) => setP(data))
      .finally(() => setLoading(false));
  }, [id]);

  const openModal = () => {
    setForm({ name: "", email: "", message: "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!sending) setModalOpen(false);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email.trim())) err.email = "Invalid email address";
    }
    if (!form.message.trim()) err.message = "Message is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    await new Promise((res) => setTimeout(res, 800)); // fake delay
    setSending(false);
    setModalOpen(false);
    setToast("Inquiry sent — the photographer will contact you soon!");
    setTimeout(() => setToast(""), 4000);
  };

  /* ---------- Loading / error shells ---------- */

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="card lift">
            <div className="card-inner">Loading profile…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="card lift">
            <div className="card-inner">Photographer not found.</div>
          </div>
        </div>
      </div>
    );
  }

  const priceLabel =
    p.price != null
      ? `₹${Number(p.price).toLocaleString("en-IN")}`
      : "Price on request";

  return (
    <div className="page-shell">
      <Toast message={toast} onClose={() => setToast("")} />

      <div className="container space-y-8">
        {/* HEADER CARD */}
        <div className="card lift">
          <div className="card-inner md:flex gap-6">
            {/* Avatar */}
            <div className="md:w-52 w-full md:flex-shrink-0">
              <div className="card-image-top" style={{ height: "13rem" }}>
                <img
                  src={
                    p.profilePic ||
                    p.portfolio?.[0] ||
                    "https://placehold.co/400x300?text=Pixisphere"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text info */}
            <div className="flex-1 flex flex-col gap-3 mt-4 md:mt-0">
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="page-title">{p.name}</h1>
                  <p className="text-sm text-muted mt-1">{p.location}</p>
                </div>

                <div className="text-right text-sm">
                  <div className="font-semibold">{priceLabel}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-amber-600 font-medium">
                    <span>{p.rating}</span>
                    <span>★</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {p.bio}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {p.styles?.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
                {p.tags?.map((t) => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="btn btn-primary text-sm"
                >
                  Send Inquiry
                </button>

                {p.portfolio?.[0] && (
                  <a
                    href={p.portfolio[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost text-sm"
                  >
                    View Sample
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PORTFOLIO */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Portfolio</h2>
          </div>
          {p.portfolio && p.portfolio.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {p.portfolio.map((img, idx) => (
                <div key={idx} className="card">
                  <div className="card-image-top" style={{ height: "9rem" }}>
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-inner text-sm text-muted">
                No portfolio images added yet.
              </div>
            </div>
          )}
        </section>

        {/* REVIEWS */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Reviews</h2>

          {p.reviews && p.reviews.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {p.reviews.map((r, idx) => (
                <div key={idx} className="card">
                  <div className="card-inner">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-amber-600 text-sm">
                        {r.rating} ★
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                    <p className="text-xs text-muted mt-2">{r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-inner text-sm text-muted">
                No reviews yet.
              </div>
            </div>
          )}
        </section>

        {/* results footer spacing mirror */}
        <div className="results-footer">That’s all for this profile.</div>
      </div>

      {/* INQUIRY MODAL */}
      <Modal open={modalOpen} onClose={closeModal}>
        <h3 className="text-lg font-semibold mb-3">
          Send Inquiry to {p.name}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">
              Your name
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Your full name"
            />
            {formErrors.name && (
              <div className="text-xs text-red-600 mt-1">
                {formErrors.name}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">
              Email
            </label>
            <input
              className="input"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <div className="text-xs text-red-600 mt-1">
                {formErrors.email}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">
              Message
            </label>
            <textarea
              className="input"
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Share details about the shoot, dates and any special requests."
            />
            {formErrors.message && (
              <div className="text-xs text-red-600 mt-1">
                {formErrors.message}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost text-sm"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm"
              disabled={sending}
            >
              {sending ? "Sending…" : "Send Inquiry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
