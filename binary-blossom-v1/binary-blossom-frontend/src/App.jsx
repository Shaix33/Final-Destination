import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // make sure this path matches your folder structure

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Future pages can be added here */}
    </Routes>
  );
}
