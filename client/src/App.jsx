import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Training from "./components/Training";
import TrainingInternship from "./components/TrainingInternship";
import LoginRegister from "./components/LoginRegister";
import Teach from "./components/Teach";
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
         <Route path="/teach" element={<Teach />} />
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training-internship" element={<TrainingInternship />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
}
