import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Training from "./components/Training";
import TrainingInternship from "./components/TrainingInternship";
import LoginRegister from "./components/LoginRegister";
import Teach from "./components/Teach";

// Make sure this path points to your main CSS file (e.g., App.css or index.css)
import './App.css'; 

export default function App() {
  return (
    <Router>
      <Navbar />

      <main>
        <Routes>
          <Route path="/teach" element={<Teach />} />
          <Route path="/" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training-internship" element={<TrainingInternship />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </main>
    </Router>
  );
}
