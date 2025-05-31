import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


import Welcome from './pages/Inicial/Welcome';

// import Home from './pages/Home/Home';
// import Register from './pages/Register/RegisterPage';
// import Login from './pages/Login/Login';
// import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
// import RecoverPassword from './pages/RecoverPassWord/RecoverPasswordPage';
// import CreateNewPassWord from './pages/CreateNewPassWord/CreateNewPassWordPage';

export default function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* {token == null ? (
          <> */}
            <Route path="/" element={<Welcome />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover" element={<RecoverPassword />} />
            <Route path="/create-password" element={<CreateNewPassWord />} />
            <Route
              path="/privacy"
              element={
                <PrivacyPolicy
                  policyText="Aqui será o texto das políticas obtido do backend"
                  lastUpdated="09 de março de 2024"
                />
              }
            /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          {/* </> */}
        {/* ) : ( */}
          <>
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        {/* )} */}
      </Routes>
    </Router>
  );
}
