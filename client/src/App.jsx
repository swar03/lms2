import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Training from "./components/Training";
import TrainingInternship from "./components/TrainingInternship";
import Curriculum from "./components/curriculum";
import LoginRegister from "./components/LoginRegister";
import Teach from "./components/Teach";
import InstructorPortal from "./components/instructorportal";
import OnboardingSurvey from "./components/OnboardingSurvey";
import MyLearnings from "./components/MyLearnings"; // <-- Imported new component MyLearnings




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
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/instructor-portal" element={<InstructorPortal />} />
          <Route path="/survey" element={<OnboardingSurvey />} />
          <Route path="/my-learnings" element={<MyLearnings />} /> {/* <-- Added new route for MyLearnings */}
        </Routes>
      </main>
    </Router>
  );
}