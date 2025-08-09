import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";



import LandingPage from "./pages/Auth/LandingPage.jsx";
import Dashboard from "./pages/Auth/Home/Dashboard.jsx";
import InterviewPrep from "./pages/Auth/Home/interviewPrep/interviewPrep.jsx";
import UserProvider from "./context/userContext.jsx";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ✅ Use the same param name you will use in InterviewPrep.jsx */}
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            toastOptions={{
              style: {
                fontSize: "13px",
              },
            }}
          />
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
