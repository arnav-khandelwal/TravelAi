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
  const { flights = [], weather = {}, days = [] } = itineraryData;

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
                  <strong>Average Temperature:</strong> {weather.avgTemp}°C
                </div>
                <div className="weather-item">
                  <strong>Condition:</strong> {weather.condition}
                </div>
                <div className="weather-item">
                  <strong>Sun Exposure:</strong> {weather.sunExposure}
                </div>
                <div className="weather-item">
                  <strong>Rain Chance:</strong> {weather.rainChance}%
                </div>
                <div className="weather-item">
                  <strong>Wind Speed:</strong> {weather.wind} km/h
                </div>
                <div className="weather-item">
                  <strong>Humidity:</strong> {weather.humidity}%
                </div>
                <div className="weather-item">
                  <strong>UV Index:</strong> {weather.uvIndex}
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
          <div className="hotels-grid">
              {[
              {
                  name: "The Grand Palace Hotel",
                  location: "New York, USA",
                  price: 15000,
                  rating: 4.5,
                  amenities: ["Free WiFi", "Breakfast Included", "Swimming Pool"],
                  image: "https://picsum.photos/200"
              },
              {
                  name: "Seaside Resort & Spa",
                  location: "Los Angeles, USA",
                  price: 18000,
                  rating: 4.8,
                  amenities: ["Ocean View", "Spa Services", "Airport Shuttle"],
                  image: "https://picsum.photos/200"
              },
              {
                  name: "Mountain Escape Lodge",
                  location: "San Francisco, USA",
                  price: 13000,
                  rating: 4.3,
                  amenities: ["Hiking Trails", "Free Parking", "Pet Friendly"],
                  image: "https://picsum.photos/200"
              },
              ].map((hotel, index) => (
              <div key={index} className="hotel-card">
                  <div className="hotel-header">
                  <img src={hotel.image} alt={hotel.name} className="hotel-image" />
                  <h3>{hotel.name}</h3>
                  <span className="hotel-location">{hotel.location}</span>
                  </div>
                  <div className="hotel-details">
                  <div>
                      <strong>Price:</strong> ₹{hotel.price.toLocaleString()} / night
                  </div>
                  <div>
                      <strong>Rating:</strong> ⭐ {hotel.rating}
                  </div>
                  <div>
                      <strong>Amenities:</strong> {hotel.amenities.join(", ")}
                  </div>
                  </div>
              </div>
              ))}
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
                  <strong>Price:</strong> ₹{flight.price.toLocaleString()}
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
      </div>
    </motion.div>
  );
}

export default ItineraryPage;