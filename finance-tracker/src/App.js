// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import DashboardComponent from './components/DashboardComponent';
import NavbarComponent from './components/NavbarComponent';
import ErrorComponent from './components/ErrorComponent';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  const handleLogin = (userData) => {
    setUserData(userData);
  };

  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={userData ? <Navigate to="/dashboard" /> : <LoginComponent handleLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/dashboard" element={userData ? <DashboardComponent data={userData} /> : <Navigate to="/login" />} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
        {/* ... other routes as needed ... */}
      </div>
    </Router>
  );
}

export default App;