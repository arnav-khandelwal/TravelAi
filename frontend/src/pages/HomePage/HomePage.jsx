import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import GlobeComponent from '../../components/Globe';
import Features from '../../components/Features';
import Testimonials from '../../components/Testimonials';
import JourneyCards from '../../components/JourneyCards';
import "react-datepicker/dist/react-datepicker.css";
import './HomePage.css';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const useFormValidation = () => {
    const [errors, setErrors] = useState({});
  
    const validateForm = (formData) => {
      const newErrors = {};
  
      if (!formData.startLocation?.trim()) {
        newErrors.startLocation = 'Starting location is required';
      }
      if (!formData.destination?.trim()) {
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const generateItinerary = async () => {
    if (!validateForm(formData)) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      const prompt = `Plan a detailed travel itinerary for the following details. Ensure the response strictly follows the JSON structure below:

- Destination: ${formData.destination}
- Departure city: ${formData.startLocation}
- Travel dates: ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}
- Budget: ${formData.budget.label}
- Travel Style: ${formData.travelStyle.label}

### **Required JSON Structure**
{
  "title": "Trip to ${formData.destination}",
  "type": "Type of trip (solo, family, business, etc.)",
  "purpose": "Purpose of the visit",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "Time in HH:MM AM/PM format",
          "activity": "Short activity name",
          "details": "Detailed description of the activity"
        }
      ]
    }
  ],
  "flights": [
    {
      "airline": "Airline Name",
      "flightNumber": "Flight Number",
      "departure": "Departure Time in ISO format",
      "arrival": "Arrival Time in ISO format",
      "price": "Estimated price",
      "details": "Additional flight details"
    }
  ],
  "weather": {
    "avgTemp": "Average Temperature in °C",
    "condition": "Weather condition (e.g., sunny, cloudy, etc.)",
    "sunExposure": "High/Moderate/Low",
    "rainChance": "Percentage chance of rain",
    "wind": "Wind speed in km/h",
    "humidity": "Humidity percentage",
    "uvIndex": "UV Index",
    "packingTips": "Suggested packing tips based on weather"
  }
}

### **Rules**
1. The response **must** be valid JSON.
2. If data is unavailable, return an empty array ([]) or null.
3. Validate the response before sending.

                    `; // Keep your prompt as it is
  
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/```json|```/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText); // Now parse the cleaned JSON string
    } catch (error) {
      console.error("Error parsing itinerary JSON:", error);
      parsedData = null;
    }

    if (!parsedData || !parsedData["days"] || !parsedData["flights"] || !parsedData["weather"]) {
      console.error("Invalid itinerary structure:", cleanedText);
      return;
    }

    const itineraryData = {
      ...parsedData,
      timestamp: new Date(),
      searchParams: formData,
    };

    localStorage.setItem("generatedItinerary", JSON.stringify(itineraryData));

    navigate("/itinerary");

  } catch (error) {
    console.error("Error generating itinerary:", error);
  } finally {
    setIsLoading(false);
  }
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

                    <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    placeholderText="Start Date"
                    className={`search-input ${errors.startDate ? 'error' : ''}`}
                    />
                    {errors.startDate && <span className="error-message">{errors.startDate}</span>}

                    <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleInputChange('endDate', date)}
                    placeholderText="End Date"
                    className={`search-input ${errors.endDate ? 'error' : ''}`}
                    />
                    {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                    
                    <Select
                    options={budgetOptions}
                    placeholder="Budget Range"
                    className={`react-select-container ${errors.budget ? 'error' : ''}`}
                    value={formData.budget}
                    onChange={(option) => handleInputChange('budget', option)}
                    />
                    {errors.budget && <span className="error-message">{errors.budget}</span>}

                    <Select
                    options={travelStyleOptions}
                    placeholder="Travel Style"
                    className={`react-select-container ${errors.travelStyle ? 'error' : ''}`}
                    value={formData.travelStyle}
                    onChange={(option) => handleInputChange('travelStyle', option)}
                    />
                    {errors.travelStyle && <span className="error-message">{errors.travelStyle}</span>}
                </div>
                <button 
                    className="generate-btn" 
                    onClick={generateItinerary}
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
    </div>
  );
}

export default HomePage;