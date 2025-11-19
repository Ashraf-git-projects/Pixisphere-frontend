// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { fetchPhotographerById } from "../api/api";

/* ------------------ Portal Modal (renders into document.body) ------------------ */
function Modal({ open, onClose, children }) {
  if (!open) return null;

  // overlay style (full viewport)
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2147483647, 
    padding: "16px",
  };

  // panel style (constrained, scrollable)
  const panelStyle = {
    background: "#ffffff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 720,
    maxHeight: "86vh",
    overflowY: "auto",
    boxShadow: "0 12px 36px rgba(2,6,23,0.28)",
    padding: 20,
  };

  return createPortal(
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ------------------ Toast (portal) ------------------ */
function Toast({ message, onClose }) {
  if (!message) return null;

  const toastStyle = {
    position: "fixed",
    right: 16,
    bottom: 16,
    background: "#16a34a",
    color: "white",
    padding: "10px 14px",
    borderRadius: 8,
    zIndex: 2147483647,
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  };

  return createPortal(
    <div style={toastStyle}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>{message}</span>
        <button onClick={onClose} style={{ fontSize: 12, opacity: 0.9 }}>
          Dismiss
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ------------------ Profile Page ------------------ */
export default function ProfilePage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  // modal + form
  const [modalOpen, setModalOpen] = useState(false);
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
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email)) e.email = "Invalid email";
    }
    if (!form.message.trim()) e.message = "Message is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSending(true);
    // simulate network delay
    await new Promise((res) => setTimeout(res, 1000));
    setSending(false);

    setModalOpen(false);
    setToast("Inquiry sent — photographer will contact you soon!");
    setTimeout(() => setToast(""), 4000);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!p) return <div className="p-6">Photographer not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast (portal) */}
      <Toast message={toast} onClose={() => setToast("")} />

      <div className="max-w-5xl mx-auto px-4">
        {/* TOP PROFILE CARD */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-8">
          <img
            src={p.profilePic}
            alt={p.name}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-sm"
          />

          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
              <p className="text-gray-500 mt-1">{p.location}</p>

              <div className="flex items-center gap-6 mt-4">
                <div className="text-xl font-semibold text-blue-700">
                  ₹{p.price.toLocaleString("en-IN")}
                </div>
                <div className="flex items-center text-amber-600 font-medium gap-1">
                  {p.rating} ★
                </div>
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed max-w-xl">
                {p.bio}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={openModal}
                className="btn btn-primary text-sm"
              >
                Send Inquiry
              </button>

              <a
                href={p.portfolio?.[0]}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost text-sm"
              >
                View Sample
              </a>
            </div>
          </div>
        </div>

        {/* PORTFOLIO */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Portfolio</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {p.portfolio.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-40 rounded-lg object-cover shadow-sm"
            />
          ))}
        </div>

        {/* REVIEWS */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Reviews</h2>
        <div className="space-y-4">
          {p.reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{r.name}</span>
                <span className="text-amber-600">{r.rating} ★</span>
              </div>
              <p className="text-gray-700">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">{r.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal (portal) */}
      <Modal open={modalOpen} onClose={closeModal}>
        <h3 className="text-xl font-semibold mb-4">Send Inquiry to {p.name}</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Your Name</label>
            <input
              className="input mt-1"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
            />
            {formErrors.name && (
              <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="input mt-1"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="input mt-1"
              rows="6"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Describe the photoshoot requirements…"
            />
            {formErrors.message && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Sending…" : "Send Inquiry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
