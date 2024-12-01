import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/layout/Header";

// Pages
import HomePage from "./pages/HomePage";
import CardEntryPage from "./pages/CardEntryPage";
import EnforcementPage from "./pages/EnforcementPage";
import SettingsPage from "./pages/SettingsPage";

// Modals
import CardEntryModal from "./components/modals/CardEntryModal";
import CardEntryManageModal from "./components/modals/CardEntryManageModal";
import EnforcementModal from "./components/modals/EnforcementModal";
import EnforcedListModal from "./components/modals/EnforcedListModal";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/card-entry" element={<CardEntryPage />} />
              <Route path="/enforcement" element={<EnforcementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>

          {/* Modals */}
          <CardEntryModal />
          <CardEntryManageModal />
          <EnforcementModal />
          <EnforcedListModal />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
