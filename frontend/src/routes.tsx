import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


import Welcome from './pages/Inicial/Welcome';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

export default function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {token == null ? (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home/>} />
          </>
        ) : (
          <>
          </>
        )}
      </Routes>
    </Router>
  );
}
