import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';

function ProtectedRoute({ children }) {
  const { loggedIn } = useSelector((state) => state.user);

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
