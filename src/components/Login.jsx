import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from './api'; // Using the centralized axios instance

export default function Login({ setToken, setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Use the centralized api instance instead of direct axios
      const res = await api.post('/auth/login', form);
      
      // Store authentication data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Update state
      setToken(res.data.token);
      setUser(res.data.user);
      
      // Redirect
      navigate('/preview');
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.msg || 
                         err.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login 👁️</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className={isLoading ? 'loading' : ''}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}