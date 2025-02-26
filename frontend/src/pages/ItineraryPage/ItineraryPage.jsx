import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ItineraryPage.css';
import { FaPlane, FaChevronLeft, FaChevronRight, FaShoppingCart, FaTimes, FaEdit } from 'react-icons/fa';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]); // manages itinerary days
  const [cartItems, setCartItems] = useState([]); // unified cart state

  const slideRef = useRef(null);

  // Fetch modified itinerary via AI
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const newItinerary = JSON.parse(response.replace(/```json|```/g, "").trim());
      if (newItinerary.days) {
        setDays(newItinerary.days);
        setItineraryData(prev => ({ ...prev, days: newItinerary.days }));
      } else {
        console.error("Invalid itinerary format");
      }
    } catch (error) {
      console.error("Error fetching new itinerary:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    console.log("Updated Days:", days);
  }, [days]);

  const handleNext = () => {
    setAnimationClass('slide-left');
    setTimeout(() => {
      setCurrentDayIndex((currentDayIndex + 1) % displayedDays.length);
      setAnimationClass('');
    }, 500);
  };

  const handlePrevious = () => {
    setAnimationClass('slide-right');
    setTimeout(() => {
      setCurrentDayIndex((currentDayIndex - 1 + displayedDays.length) % displayedDays.length);
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

  // Add an item (hotel or flight) to the cart if not already added
  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if item of same type and category already exists
      const exists = prev.some(cartItem => 
        (item.type === 'hotel' && cartItem.type === 'hotel') || // Only one hotel allowed
        (item.type === 'flight' && cartItem.type === 'flight' && cartItem.category === item.category) // One flight per category
      );

      if (exists) {
        alert(`You can only add one ${item.type}${item.category ? ` for ${item.category}` : ''} to the cart.`);
        return prev;
      }

      // Convert price to number before adding to cart
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
        : Number(item.price);

      return [...prev, { ...item, price }];
    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemToRemove) => {
    setCartItems(prev =>
      prev.filter(item => !(item.type === itemToRemove.type && 
        item.index === itemToRemove.index && 
        item.category === itemToRemove.category))
    );
  };

  // Calculate the total price from all items in the cart
  const totalPrice = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
      : Number(item.price);
    return total + price;
  }, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Proceeding to checkout! Total: ${totalPrice.toLocaleString()}`);
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

  const { flights = {}, weather = {}, days: itineraryDays = [], hotels = [] } = itineraryData;
  const displayedDays = days.length > 0 ? days : itineraryData.days;
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  // Check if an item is already in the cart (useful for button toggling)
  const isItemInCart = (type, index, category = null) => {
    return cartItems.some(item => item.type === type && item.index === index && item.category === category);
  };

  return (
    <motion.div className="itinerary-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
        {displayedDays.length > 0 ? (
          <div className="slideshow" ref={slideRef}>
            <div className={`day-card ${animationClass}`}>
              <div className="day-header">
                <button className="nav-button" onClick={handlePrevious}>
                  <FaChevronLeft />
                </button>
                <h3>Day {displayedDays[currentDayIndex].day}</h3>
                <button className="nav-button" onClick={handleNext}>
                  <FaChevronRight />
                </button>
              </div>
              <div className="timeline">
                {displayedDays[currentDayIndex].activities.map((activity, index) => (
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
          <p>Loading itinerary...</p>
        )}

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
                  {isItemInCart("hotel", index, null) ? (
                    <button
                      className="remove-from-cart"
                      onClick={() => removeFromCart({ type: "hotel", index, category: null })}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart({ 
                        type: "hotel", 
                        index, 
                        category: null, 
                        details: hotel, 
                        price: parseFloat(hotel.price.toString().replace(/[^0-9.-]+/g, ''))
                      })}
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
        <div className="flight-category">
          <h3>Departure</h3>
          <hr/><br/>
          <div className="flights-grid">
            {flights.toDestination && flights.toDestination.length > 0 ? (
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
                  {isItemInCart("flight", index, "departure") ? (
                    <button
                      className="remove-from-cart"
                      onClick={() => removeFromCart({ type: "flight", index, category: "departure" })}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart({ 
                        type: "flight", 
                        index, 
                        category: "departure", 
                        details: flight, 
                        price: parseFloat(flight.price.toString().replace(/[^0-9.-]+/g, ''))
                      })}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No departure flight details available.</p>
            )}
          </div>
        </div>
        <br/><br/>
        <div className="flight-category">
          <h3>Return</h3>
          <hr/><br/>
          <div className="flights-grid">
            {flights.fromDestination && flights.fromDestination.length > 0 ? (
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
                  {isItemInCart("flight", index, "return") ? (
                    <button
                      className="remove-from-cart"
                      onClick={() => removeFromCart({ type: "flight", index, category: "return" })}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart({ 
                        type: "flight", 
                        index, 
                        category: "return", 
                        details: flight, 
                        price: parseFloat(flight.price.toString().replace(/[^0-9.-]+/g, ''))
                      })}
                    >
                      Add to Cart
                    </button>
                  )}
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
        {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
      </div>

      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={toggleCart}></div>

      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {cartItems.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  {item.type === "hotel" && (
        <img 
          src={item.details.image || ""} 
          alt={item.details.name || "Hotel"} 
          className="cart-item-image" 
        />
      )}
                  <div className="cart-item-details">
                    <h4>{item.type === "hotel" ? item.details.name : item.details.airline}</h4>
                    <p>
                      {item.type === "hotel" 
                        ? item.details.location 
                        : item.category === "departure" 
                          ? "Departure Flight" 
                          : "Return Flight"}
                    </p>
                    <div className="cart-item-price">
                      {item.details.currency || "$"} {item.price.toLocaleString()} /-
                    </div>
                    <button 
                      className="remove-from-cart" 
                      onClick={() => removeFromCart(item)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                Total: {cartItems[0]?.details?.currency || "$"} {totalPrice.toLocaleString()} /-
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ItineraryPage;