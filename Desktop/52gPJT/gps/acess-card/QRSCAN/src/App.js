import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WorkerManagementPage from "./pages/WorkerManagementPage";
import EntryLogsPage from "./pages/EntryLogsPage";
import Navigation from "./components/layouts/Navigation";

function App() {
  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workers" element={<WorkerManagementPage />} />
          <Route path="/logs" element={<EntryLogsPage />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
