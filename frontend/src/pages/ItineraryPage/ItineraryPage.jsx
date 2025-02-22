import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ItineraryPage.css';

function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState(null);

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
      <header className="itinerary-header">
        <h1>{itineraryData.title}</h1>
      </header>

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

      {/* Daily Itinerary Section */}
      <section className="section daily-section">
        <h2>Daily Itinerary</h2>
        {days.length > 0 ? (
          days.map((day) => (
            <div key={day.day} className="day-card">
              <h3>Day {day.day}</h3>
              <div className="timeline">
                {day.activities.map((activity, index) => (
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
          ))
        ) : (
          <p>No itinerary available.</p>
        )}
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
