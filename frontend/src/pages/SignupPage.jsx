import React, { useState } from 'react';
import { Loader2, Mail, Lock, User, Calendar, MapPin, Phone, Camera, Plane } from 'lucide-react';
import './SignupPage.css';

function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    country: '',
    city: '',
    interests: [],
    avatar: '',
    termsAccepted: false,
    newsletterSubscribed: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: ''
  });

  const interestOptions = [
    'Adventure Travel', 'Cultural Experiences', 'Food & Cuisine',
    'Beach Getaways', 'Urban Exploration', 'Nature & Wildlife',
    'Historical Sites', 'Local Events', 'Photography'
  ];

  const validateStep = (currentStep) => {
    const newErrors = { ...errors };
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
        isValid = false;
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="image-slider">
        <div className="slider-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card signup-card">
          <div className="auth-header">
            <div className="logo-container">
              <Plane className="plane-icon" />
            </div>
            <h2>Join TravelAI</h2>
            <p>Start your journey with us</p>
            
            <div className="step-indicator">
              {[1, 2, 3].map(i => (
                <div key={i} className={`step ${step >= i ? 'active' : ''}`}>
                  <div className="step-number">{i}</div>
                  <span className="step-label">
                    {i === 1 ? 'Account' : i === 2 ? 'Profile' : 'Preferences'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form signup-form">
            {step === 1 && (
              <div className="form-step">
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

                <div className="form-group">
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      type="password"
                      className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder=" "
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <label className="floating-label">Confirm Password</label>
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <div className="form-row">
                  <div className="form-group">
                    <div className="input-container">
                      <User className="input-icon" />
                      <input
                        type="text"
                        className={`input-field ${errors.firstName ? 'error' : ''}`}
                        placeholder=" "
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                      <label className="floating-label">First Name</label>
                    </div>
                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                  </div>

                  <div className="form-group">
                    <div className="input-container">
                      <User className="input-icon" />
                      <input
                        type="text"
                        className={`input-field ${errors.lastName ? 'error' : ''}`}
                        placeholder=" "
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                      <label className="floating-label">Last Name</label>
                    </div>
                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <Calendar className="input-icon" />
                    <input
                      type="date"
                      className={`input-field ${errors.dateOfBirth ? 'error' : ''}`}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                    <label className="floating-label">Date of Birth</label>
                  </div>
                  {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth}</p>}
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      className={`input-field ${errors.phone ? 'error' : ''}`}
                      placeholder=" "
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <label className="floating-label">Phone Number</label>
                  </div>
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div className="input-container">
                      <MapPin className="input-icon" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder=" "
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                      />
                      <label className="floating-label">Country</label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-container">
                      <MapPin className="input-icon" />
                      <input
                        type="text"
                        className="input-field"
                        placeholder=" "
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                      <label className="floating-label">City</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Profile" />
                    ) : (
                      <Camera className="camera-icon" />
                    )}
                  </div>
                  <button type="button" className="upload-button">
                    Upload Photo
                  </button>
                </div>

                <div className="interests-section">
                  <h3>Travel Interests</h3>
                  <div className="interests-grid">
                    {interestOptions.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    />
                    <span>I accept the Terms and Conditions</span>
                  </label>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData.newsletterSubscribed}
                      onChange={(e) => setFormData({...formData, newsletterSubscribed: e.target.checked})}
                    />
                    <span>Subscribe to newsletter</span>
                  </label>
                </div>
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="next-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData.termsAccepted}
                  className="submit-button"
                >
                  {isLoading ? (
                    <Loader2 className="spinner" />
                  ) : (
                    'Complete Signup'
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <a href="#">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;