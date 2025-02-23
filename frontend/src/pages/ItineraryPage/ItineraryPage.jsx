import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ItineraryPage.css';
import { FaPlane, FaChevronLeft, FaChevronRight, FaShoppingCart, FaTimes, FaEdit  } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(null);
  const slideRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchItinerary = async () => {
    if (!userPrompt) return;

    setLoading(true);
    const prompt = `You are an intelligent assistant modifying an existing travel itinerary **strictly according to user instructions**. 

    ### **Task**
    Modify the itinerary **only where requested** and **keep all other details unchanged**.

    ### **User Request**
    "${userPrompt}"

    ### **Current Itinerary**
    ${JSON.stringify({
        title: itineraryData.title,
        type: itineraryData.type,
        purpose: itineraryData.purpose,
        days: itineraryData.days
        })}

    ### **Instructions**
    1. **Only update the specific changes requested by the user**. If the request is unclear, make minimal logical changes.
    2. **Do not alter days, times, or activities unless specifically mentioned**.
    3. **Return valid JSON with the same structure**, preserving existing information.
    4. **Ensure the response is under 4000 characters** and properly formatted.

    **Return only the modified JSON output just like the current itinerary. No extra text.**`;


    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const newItinerary =  response.text().replace(/```json|```/g, "").trim();

      setDays(newItinerary.days);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error fetching new itinerary:", error);
    } finally {
      setLoading(false);
    }
  };


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

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const addToCart = (index) => {
    setSelectedHotelIndex(index);
  };

  const removeFromCart = () => {
    setSelectedHotelIndex(null);
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

  const { flights = [], weather = {}, days = [], hotels = [] } = itineraryData;
  const selectedHotel = selectedHotelIndex !== null ? hotels[selectedHotelIndex] : null;

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
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/" className="logo-link">
            <FaPlane className="logo-icon" />
            <span className="logo-text">TravelAI</span>
          </Link>
        </div>
        <div className="auth-buttons">
          <Link to="/auth" className="sign-in-btn">Sign In</Link>
          <Link to="/signup" className="sign-up-btn">Sign Up</Link>
        </div>
      </header>

      <header className="itinerary-header">
        <br/><br/><br/>
        <h1>{itineraryData.title}</h1>
      </header>

      <section className="section daily-section">
      <div className="section-header">
        <h2>Daily Itinerary</h2>
        <button className="edit-button" onClick={() => setIsModalOpen(true)}>
            <FaEdit /> Edit Itinerary
        </button>
        </div>
    <br/>
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

        {/* AI Input Modal */}
       {/* Modal for Editing Itinerary */}
       {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Your Itinerary</h3>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter what changes you want in your itinerary..."
            />
            <button className="submit-button" onClick={fetchItinerary} disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </button>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      </section>

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

      <section className="section hotels-section">
        <h2>Recommended Hotels</h2>
        <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "-10px" }}>
          <i>*Prices are for the whole stay and not just one night.</i>
        </p>
        <div className="hotels-grid">
          {hotels.length > 0 ? (
            hotels.slice(0, 6).map((hotel, index) => (
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
                  {selectedHotelIndex === index ? (
                    <button
                      className="remove-from-cart"
                      onClick={removeFromCart}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(index)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No hotel details available.</p>
          )}
        </div>
      </section>

      <section className="section flights-section">
  <h2>Flight Information</h2>

  {/* Flights to the Destination */}
  <div className="flight-category">
    <h3>Departure</h3>
    <div className="flights-grid">
      {flights.toDestination.length > 0 ? (
        flights.toDestination.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-header">
              <h3>{flight.airline}</h3>
            </div>
            <div className="flight-times">
              <div>
                <strong>Departure:</strong> {flight.departure} at {formatDateTime(flight.depTime)}
              </div>
              <div>
                <strong>Arrival:</strong> {flight.arrival} at {formatDateTime(flight.arrTime)}
              </div>
            </div>
            <div className="flight-price">
              <strong>Price:</strong> {flight.price.toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <p>No flight details available.</p>
      )}
    </div>
  </div>

  {/* Flights Returning from the Destination */}
  <div className="flight-category">
    <h3>Return</h3>
    <div className="flights-grid">
      {flights.fromDestination.length > 0 ? (
        flights.fromDestination.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-header">
              <h3>{flight.airline}</h3>
            </div>
            <div className="flight-times">
              <div>
                <strong>Departure:</strong> {flight.departure} at {formatDateTime(flight.depTime)}
              </div>
              <div>
                <strong>Arrival:</strong> {flight.arrival} at {formatDateTime(flight.arrTime)}
              </div>
            </div>
            <div className="flight-price">
              <strong>Price:</strong> {flight.price.toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <p>No return flight details available.</p>
      )}
    </div>
  </div>
</section>

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

      <div className="cart-icon-container" onClick={toggleCart}>
        <FaShoppingCart size={24} />
        {selectedHotel && <span className="cart-count">1</span>}
      </div>

      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={toggleCart}></div>

      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>
        {!selectedHotel ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="cart-item">
            <img src={selectedHotel.image} alt={selectedHotel.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{selectedHotel.name}</h4>
              <p>{selectedHotel.location}</p>
              <div className="cart-item-price">
                {selectedHotel.currency} {selectedHotel.price.toLocaleString()} /-
              </div>
              <button className="remove-from-cart" onClick={removeFromCart}>
                Remove from Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ItineraryPage;