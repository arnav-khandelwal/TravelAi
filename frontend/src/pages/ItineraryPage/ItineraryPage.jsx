import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ItineraryPage.css';
import { FaPlane, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const slideRef = useRef(null);

  const handleNext = () => {
    setAnimationClass('slide-left');
    setTimeout(() => {
      setCurrentDayIndex((currentDayIndex + 1) % days.length);
      setAnimationClass('');
    }, 500);
  };

  const handlePrevious = () => {
    setAnimationClass('slide-right');
    setTimeout(() => {
      setCurrentDayIndex((currentDayIndex - 1 + days.length) % days.length);
      setAnimationClass('');
    }, 500);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setPrevTranslate(currentTranslate);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const currentPosition = e.pageX;
      const diff = currentPosition - startX;
      setCurrentTranslate(prevTranslate + diff);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100) {
      handleNext();
    } else if (movedBy > 100) {
      handlePrevious();
    }
    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  useEffect(() => {
    const slide = slideRef.current;
    if (slide) {
      slide.addEventListener('mousedown', handleMouseDown);
      slide.addEventListener('mousemove', handleMouseMove);
      slide.addEventListener('mouseup', handleMouseUp);
      slide.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      if (slide) {
        slide.removeEventListener('mousedown', handleMouseDown);
        slide.removeEventListener('mousemove', handleMouseMove);
        slide.removeEventListener('mouseup', handleMouseUp);
        slide.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, [isDragging, currentTranslate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const savedItinerary = localStorage.getItem("generatedItinerary");
      if (savedItinerary) {
        const parsedItinerary = JSON.parse(savedItinerary);
        
        if (parsedItinerary && parsedItinerary.days) {
          setItineraryData(parsedItinerary);
          console.log("Loaded Itinerary:", parsedItinerary);
        } else {
          console.error("Invalid itinerary structure:", parsedItinerary);
        }
      }
    } catch (error) {
      console.error("Error loading itinerary:", error);
    }
  }, []);
  

  if (!itineraryData) {
    return <div className="loading">Loading itinerary...</div>;
  }

  // Ensure data exists before accessing it
  const { flights = [], weather = {}, days = [], hotels = [] } = itineraryData;

  // Format date-time string to readable format
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  return (
    <motion.div 
      className="itinerary-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title Section */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="logo">
                <Link to="/" className="logo-link">
                <FaPlane className="logo-icon" />
                <span className="logo-text">TravelAI</span>
                </Link>
                </div>
                <div className="auth-buttons">
                  <button className="sign-in-btn">Sign In</button>
                  <button className="sign-up-btn">Sign Up</button>
                </div>
      </header>
      <header className="itinerary-header">
      <br/><br/><br/>
        <h1>{itineraryData.title}</h1>
      </header>

        {/* Daily Itinerary Section */}
        <section className="section daily-section">
        <h2>Daily Itinerary</h2>
        {days.length > 0 ? (
            <div className="slideshow" ref={slideRef}>
            <div className={`day-card ${animationClass}`}>
                <div className="day-header">
                <button className="nav-button" onClick={handlePrevious}>
                    <FaChevronLeft />
                </button>
                <h3>Day {days[currentDayIndex].day}</h3>
                <button className="nav-button" onClick={handleNext}>
                    <FaChevronRight />
                </button>
                </div>
                <div className="timeline">
                {days[currentDayIndex].activities.map((activity, index) => (
                    <div key={index} className="timeline-item">
                    <div className="timeline-time">{activity.time}</div>
                    <div className="timeline-content">
                        <h4>{activity.activity}</h4>
                        <p>{activity.details}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        ) : (
            <p>No itinerary available.</p>
        )}
        </section>

        {/* Weather Section */}
      <section className="section weather-section">
        <h2>Weather Information</h2>
        <div className="weather-card">
          {weather.avgTemp ? (
            <>
              <div className="weather-grid">
                <div className="weather-item">
                  <strong>Average Temperature:</strong> {weather.avgTemp}
                </div>
                <div className="weather-item">
                  <strong>Condition:</strong> {weather.condition}
                </div>
                <div className="weather-item">
                  <strong>Rain Chance:</strong> {weather.rainChance}
                </div>
                <div className="weather-item">
                  <strong>Wind Speed:</strong> {weather.wind}
                </div>
                <div className="weather-item">
                  <strong>Humidity:</strong> {weather.humidity}
                </div>
              </div>
              <div className="packing-tips">
                <h3>Packing Tips</h3>
                <p>{weather.packingTips}</p>
              </div>
            </>
          ) : (
            <p>No weather details available.</p>
          )}
        </div>
      </section>

        {/* Hotels Section */}
<section className="section hotels-section">
    <h2>Recommended Hotels</h2>
    <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "-10px" }}>
    <i>*Prices are for the whole stay and not just one night.</i>
    </p>
  <div className="hotels-grid">
    {hotels.length > 0 ? (
      hotels.slice(0, 6).map((hotel, index) => ( // Display only first 6 hotels
        <div key={index} className="hotel-card">
          <div className="hotel-header">
            <img src={hotel.image} alt={hotel.name} className="hotel-image" />
            <h3>{hotel.name}</h3>
            <span className="hotel-location">{hotel.location}</span>
          </div>
          <div className="hotel-details">
            <div>
              <strong>Price:</strong> {hotel.currency} {hotel.price.toLocaleString()} /-
            </div>
            <div>
              <strong>Rating:</strong> ⭐ {hotel.rating}
            </div>
            <div>
              <strong>Amenities:</strong> {hotel.amenities.join(", ")}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No hotel details available.</p>
    )}
  </div>
</section>




      {/* Flight Details Section */}
      <section className="section flights-section">
        <h2>Flight Information</h2>
        <div className="flights-grid">
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <h3>{flight.airline}</h3>
                  <span className="flight-number">Flight {flight.flightNumber}</span>
                </div>
                <div className="flight-times">
                  <div>
                    <strong>Departure:</strong> {formatDateTime(flight.departure)}
                  </div>
                  <div>
                    <strong>Arrival:</strong> {formatDateTime(flight.arrival)}
                  </div>
                </div>
                <div className="flight-price">
                  <strong>Price:</strong> {flight.price.toLocaleString()}
                </div>
                <div className="flight-details">{flight.details}</div>
              </div>
            ))
          ) : (
            <p>No flight details available.</p>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={() => window.print()} className="print-btn">
          Print Itinerary
        </button>
        <button
          onClick={() =>
            navigator.share({
              title: itineraryData.title,
              text: JSON.stringify(itineraryData, null, 2),
            })
          }
          className="share-btn"
        >
          Share Itinerary
        </button>
        <chatbot />
      </div>
    </motion.div>
  );
}

export default ItineraryPage;