// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<CategoryPage />} />
        <Route path="/photographer/:id" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
