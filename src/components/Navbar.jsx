import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ token, logout }) {
  return (
    <nav className="navbar">
      <h1>Portfolio Builder ⚙️</h1>
      <div>
        {token ? (
          <>
            <Link to="/profile">Edit Profile</Link>
            <Link to="/preview">Preview</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login 🔥</Link>
            <Link to="/register">Register 🔥</Link>
          </>
        )}
      </div>
    </nav>
  );
}
