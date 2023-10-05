// src/components/Homepage.js
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div>
      <h1>Finance Tracker</h1>
      <Link to="/login">Login</Link>
      <Link to="/register">Sign Up</Link>
    </div>
  );
};

export default Homepage;