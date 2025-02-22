import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Loader, Placeholder } from "rsuite";
import Select from 'react-select';
import GlobeComponent from '../../components/Globe';
import Features from '../../components/Features';
import Testimonials from '../../components/Testimonials';
import JourneyCards from '../../components/JourneyCards';
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from 'react-select/async';
import "rsuite/dist/rsuite.min.css";
import './HomePage.css';
import generateItinerary from "../../utils/generateItinerary";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-date-input" onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      readOnly
      placeholder={placeholder}
      className="search-input"
    />
    <FaCalendarAlt className="calendar-icon" />
  </div>
));



const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.startLocation) {
      newErrors.startLocation = 'Starting location is required';
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.budget?.value) {
      newErrors.budget = 'Budget range is required';
    }
    if (!formData.travelStyle?.value) {
      newErrors.travelStyle = 'Travel style is required';
    }

    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm };
};


function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    startDate: null,
    endDate: null,
    budget: null,
    travelStyle: null
  });
  const { errors, validateForm } = useFormValidation();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const budgetOptions = [
    { value: 'budget', label: 'Budget Friendly' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const travelStyleOptions = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'foodie', label: 'Foodie' }
  ];

  const handleGenerateItinerary = () => {
    generateItinerary(formData, setIsLoading, navigate);
};


  return (
    <div className="app">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
            <Link to="/" className="logo-link">
            <FaPlane className="logo-icon" />
            <span className="logo-text">TravelAI</span>
            </Link>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#destinations">Destinations</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="auth-buttons">
        <Link to="/auth" className="sign-in-btn">Sign In</Link>
        <Link to="/signup" className="sign-up-btn">Sign Up</Link>
        </div>
      </header>

      <main>
        <motion.section 
          className="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TypeAnimation
                sequence={[
                  'Smarter Travel Planning',
                  2000,
                  'AI-Powered Itineraries',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Let AI craft your perfect journey. From hidden gems to popular spots, we've got your dream trip covered.
            </motion.p>
            
            <motion.div 
              className="search-form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="search-grid">
              <div className="input-group">
                <input
                    type="text"
                    placeholder="Starting Location"
                    className={`search-input ${errors.startLocation ? 'error' : ''}`}
                    value={formData.startLocation}
                    onChange={(e) => handleInputChange('startLocation', e.target.value)}
                />
                {errors.startLocation && <span className="error-message">{errors.startLocation}</span>}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="Destination"
                    className={`search-input ${errors.destination ? 'error' : ''}`}
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                />
                {errors.destination && <span className="error-message">{errors.destination}</span>}
            </div>


            <div className="input-group">
                <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                placeholderText="Start Date"
                className={`search-input ${errors.startDate ? 'error' : ''}`}
                minDate={new Date()}
                customInput={<CustomDateInput placeholder="Start Date" />}
                />
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="input-group">
                <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                placeholderText="End Date"
                className={`search-input ${errors.endDate ? 'error' : ''}`}
                minDate={formData.startDate || new Date()}
                customInput={<CustomDateInput placeholder="End Date" />}
                />
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>

            <div className="input-group">
                <Select
                options={budgetOptions}
                placeholder="Budget Range"
                className={`react-select-container ${errors.budget ? 'error' : ''}`}
                value={formData.budget}
                onChange={(option) => handleInputChange('budget', option)}
                />
                {errors.budget && <span className="error-message">{errors.budget}</span>}
            </div>

            <div className="input-group">
                <Select
                options={travelStyleOptions}
                placeholder="Travel Style"
                className={`react-select-container ${errors.travelStyle ? 'error' : ''}`}
                value={formData.travelStyle}
                onChange={(option) => handleInputChange('travelStyle', option)}
                />
                {errors.travelStyle && <span className="error-message">{errors.travelStyle}</span>}
            </div>
                </div>
                <button 
                    className="generate-btn" 
                    onClick={handleGenerateItinerary}
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <span>Generating...</span>
                    ) : (
                    <>
                        <FaSearch style={{ marginRight: '0.5rem' }} />
                        Generate My Trip
                    </>
                    )}
                </button>
            </motion.div>
          </div>
          <motion.div 
            className="globe-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlobeComponent />
          </motion.div>
        </motion.section>

        <motion.section 
          id="features" 
          className="section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Features />
        </motion.section>

        <motion.section 
          id="destinations" 
          className="journey-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Journey Inspirations from Travelers</h2>
          <JourneyCards />
        </motion.section>

        <motion.section 
          id="testimonials" 
          className="section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Testimonials />
        </motion.section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TravelAI</h3>
            <p>Making travel planning effortless with AI</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#features">Features</a>
            <a href="#destinations">Destinations</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@travelai.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 TravelAI. All rights reserved.</p>
        </div>
      </footer>
      <chatbot />
    </div>
  );
}

export default HomePage;