// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="app-footer bg-white border-t border-gray-200 mt-12">
      <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            P
          </div>
          <span className="font-semibold text-gray-700">Pixisphere</span>
        </div>

        {/* Center */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Pixisphere. All rights reserved.
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-800 transition">Privacy</a>
          <a href="#" className="hover:text-gray-800 transition">Terms</a>
          <a href="#" className="hover:text-gray-800 transition">Support</a>
        </div>
      </div>
    </footer>
  );
}
