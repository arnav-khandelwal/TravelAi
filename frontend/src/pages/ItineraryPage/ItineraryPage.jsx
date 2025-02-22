import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import './ItineraryPage.css';

function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(1);

  const tripDetails = {
    destination: "Paris, France",
    duration: "7 Days",
    dates: "March 15 - March 21, 2024",
    travelers: "2 Adults"
  };

  const itineraryData = [
    {
      day: 1,
      activities: [
        {
          time: "09:00 AM",
          title: "Eiffel Tower Visit",
          description: "Start your day with a visit to the iconic Eiffel Tower. Pre-booked skip-the-line tickets included."
        },
        {
          time: "12:30 PM",
          title: "Lunch at Le Petit Bistrot",
          description: "Traditional French cuisine in a charming local bistro."
        },
        {
          time: "02:30 PM",
          title: "Seine River Cruise",
          description: "1-hour scenic cruise along the Seine River."
        }
      ]
    },
    {
      day: 2,
      activities: [
        {
          time: "10:00 AM",
          title: "Louvre Museum",
          description: "Guided tour of the world's largest art museum."
        },
        {
          time: "01:00 PM",
          title: "Lunch in Le Marais",
          description: "Explore the historic Le Marais district and enjoy lunch at a local café."
        }
      ]
    }
  ];

  const budgetBreakdown = {
    accommodation: 1200,
    activities: 500,
    transportation: 300,
    food: 600
  };

  const importantNotes = [
    "Museum Pass valid for all 7 days",
    "Restaurant reservations required 24h in advance",
    "Metro passes included in transportation budget",
    "Free walking tours available daily"
  ];

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h1>Your Paris Adventure</h1>
        <p>AI-Generated Travel Itinerary</p>
      </div>

      <div className="trip-details">
        <h2>Trip Overview</h2>
        <div className="trip-info">
          <div className="info-item">
            <h3>Destination</h3>
            <p><FaMapMarkerAlt /> {tripDetails.destination}</p>
          </div>
          <div className="info-item">
            <h3>Duration</h3>
            <p><FaClock /> {tripDetails.duration}</p>
          </div>
          <div className="info-item">
            <h3>Dates</h3>
            <p><FaCalendarAlt /> {tripDetails.dates}</p>
          </div>
          <div className="info-item">
            <h3>Travelers</h3>
            <p><FaInfoCircle /> {tripDetails.travelers}</p>
          </div>
        </div>
      </div>

      <div className="map-container">
        <p>Interactive Map Coming Soon</p>
      </div>

      <div className="day-by-day">
        <h2>Day-by-Day Itinerary</h2>
        {itineraryData.map((day) => (
          <div key={day.day} className="day-card">
            <div className="day-header">
              <h3>Day {day.day}</h3>
            </div>
            <div className="day-content">
              {day.activities.map((activity, index) => (
                <div key={index} className="activity">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="budget-section">
        <h2>Budget Breakdown</h2>
        <div className="budget-grid">
          {Object.entries(budgetBreakdown).map(([category, amount]) => (
            <div key={category} className="budget-item">
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="budget-amount">${amount}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-section">
        <h2>Important Notes</h2>
        <ul className="notes-list">
          {importantNotes.map((note, index) => (
            <li key={index} className="note-item">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ItineraryPage;