
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Dashboard from "./pages/Dashboard/Dashboard";
import MainLayout from "./Layout/MainLayout/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
