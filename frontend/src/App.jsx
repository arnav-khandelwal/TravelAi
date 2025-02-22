import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ItineraryPage from "./pages/ItineraryPage/ItineraryPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/itinerary" element={<ItineraryPage />} />

    <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;