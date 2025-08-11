import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import ProfilePreview from './components/ProfilePreview';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Navbar token={token} logout={logout} >{user}</Navbar>
      <div className="container">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
          <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
          <Route path="/profile" element={token ? <ProfileForm token={token} /> : <Navigate to="/login" />} />
          <Route path="/preview" element={token ? <ProfilePreview token={token} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
