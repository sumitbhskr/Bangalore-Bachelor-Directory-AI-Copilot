// src/App.js
import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AiCopilot from "./components/AiCopilot";

// Pages
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import DetailPage from "./pages/DetailPage";
import Dashboard from "./pages/Dashboard";

// ── Inner app (needs context access) ────────────────────────
function Inner() {
  const { page, showAuth, selectedListing,  } = useApp();

  // Track browse initial filters separately (non-listing data)
  const [browseInit] = useState({});

 

  // Provide wrappedNavigate to children via a thin override context is complex;
  // simpler: HomePage / Footer call navigate directly from context (works fine).
  // browseInit is only needed by BrowsePage, so pass it as a prop.

  return (
    <div>
      <Navbar />

      {/* Page router */}
      {page === "home" && <HomePage />}
      {page === "browse" && <BrowsePage initialFilters={browseInit} />}
      {page === "detail" && selectedListing && (
        <DetailPage listing={selectedListing} />
      )}
      {page === "dashboard" && <Dashboard />}

      {/* Global overlays */}
      {showAuth && <AuthModal />}
      <AiCopilot />

      <Footer />
    </div>
  );
}

// ── Root with Provider ───────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
