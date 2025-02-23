import React, { useState } from 'react';
import { Loader2, Mail, Lock, Plane, MapPin } from 'lucide-react';
import './AuthPage.css';

function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {
      email: !formData.email ? 'Email is required' : 
             !/\S+@\S+\.\S+/.test(formData.email) ? 'Invalid email format' : '',
      password: !formData.password ? 'Password is required' : 
               formData.password.length < 6 ? 'Password must be at least 6 characters' : ''
    };
    
    setErrors(newErrors);
    
    if (newErrors.email || newErrors.password) {
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="image-slider">
        <div className="slider-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <Plane className="plane-icon" />
            </div>
            <h2>Welcome to TravelAI</h2>
            <p>Your AI-powered travel companion</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="popular-destinations">
              <MapPin className="map-icon" />
              <span>Popular destinations: </span>
              <div className="destination-tags">
                <span>Paris</span>
                <span>Tokyo</span>
                <span>New York</span>
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'error' : ''}`}
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <label className="floating-label">Email</label>
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type="password"
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  placeholder=" "
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <label className="floating-label">Password</label>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <Loader2 className="spinner" />
              ) : (
                'Start Your Journey'
              )}
            </button>

          </form>

          <div className="auth-footer">
            <p>Don't have an account? <a href="/signup">Sign up for free</a></p>
            <p><a href="/">Back to homepage</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;