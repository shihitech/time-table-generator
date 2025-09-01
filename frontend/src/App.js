import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TimetablePage from "./pages/TimetablePage";
import NavBar from "./components/NavBar";

function App() {
  const [timetable, setTimetable] = useState(null);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<HomePage onGenerated={setTimetable} />} />
            <Route
              path="/timetable"
              element={
                timetable ? (
                  <TimetablePage timetable={timetable} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
