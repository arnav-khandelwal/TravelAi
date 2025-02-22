import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import GlobeComponent from './components/Globe';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import JourneyCards from './components/JourneyCards';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  return (
    <div className="app">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <FaPlane className="logo-icon" />
          TravelAI
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#destinations">Destinations</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="auth-buttons">
          <button className="sign-in-btn">Sign In</button>
          <button className="sign-up-btn">Sign Up</button>
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
                    className="search-input"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Destination"
                    className="search-input"
                  />
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="search-input"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  className="search-input"
                />
                <Select
                  options={budgetOptions}
                  placeholder="Budget Range"
                  className="react-select-container"
                />
                <Select
                  options={travelStyleOptions}
                  placeholder="Travel Style"
                  className="react-select-container"
                />
              </div>
              <button className="generate-btn">
                <FaSearch style={{ marginRight: '0.5rem' }} />
                Generate My Trip
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
    </div>
  );
}

export default App;