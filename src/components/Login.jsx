import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons
import { useNavigate } from 'react-router-dom'; 

export default function Login({ setToken, setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form, {
  headers: {
    'Content-Type': 'application/json'
  }
});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/preview');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login 👁️</h2>
      {error && <p className="error">{error}</p>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <div className="password-input-wrapper">
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <span
          className="password-toggle-icon"
          onClick={togglePassword}
          role="button"
          tabIndex={0}
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
