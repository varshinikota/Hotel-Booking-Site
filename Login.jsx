import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  // State for storing email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      // Send a POST request to store the user in db.json
      await axios.post('http://localhost:3000/users', userData);

      // Update auth state and navigate to home
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#eaf6f6' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="form-signin text-center p-5 rounded shadow-lg" style={{ backgroundColor: '#ffffff', borderRadius: '15px' }}>
          <h1 className="h4 mb-4 fw-normal" style={{ color: '#333333', fontWeight: '600' }}>Welcome Back</h1>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>Log in to continue your booking experience.</p>
          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label style={{ color: '#6c757d' }}>Email address</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label style={{ color: '#6c757d' }}>Password</label>
            </div>
            <button
              className="btn btn-primary w-100 py-2"
              type="submit"
              style={{ backgroundColor: '#4CAF50', border: 'none', borderRadius: '10px' }}
            >
              Sign in
            </button>
          </form>
          <p className="mt-3" style={{ color: '#6c757d', fontSize: '0.9rem' }}>Forgot your password?</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
