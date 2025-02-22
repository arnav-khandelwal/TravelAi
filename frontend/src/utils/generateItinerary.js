import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
};

const fetchCoordinates = async (city) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            console.error("City not found");
            return null;
        }

        return {
            latitude: data[0].lat,
            longitude: data[0].lon
        };
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

const generateItinerary = async (formData, setIsLoading, navigate) => {
    if (!formData) return;

    const checkinDate = formatDate(new Date("2025-02-24"));
    const checkoutDate = formatDate(new Date("2025-02-27"));

    setIsLoading(true);
    try {
        const prompt = `Plan a detailed travel itinerary for the following details. Ensure the response strictly follows the JSON structure below, but **keep it concise** to fit within 4000 characters:

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
          "details": "Brief description (Max: 20 words)"
        }
      ]
    }
  ],
  "flights": [
    {
      "airline": "Airline Name",
      "departure": "Departure Time in ISO format",
      "arrival": "Arrival Time in ISO format",
      "price": "Estimated price"
    }
  ],
  "weather": {
    "avgTemp": "Average Temperature in °C",
    "condition": "Weather condition (e.g., sunny, cloudy, etc.)",
    "rainChance": "Percentage chance of rain",
    "wind": "Wind speed in km/h",
    "packingTips": "Suggested packing items"
  },
  "hotels": [] // Placeholder for hotels fetched from API
}

### **Rules**
1. Keep the JSON response **under 4000 characters**.
2. Limit activities to **max 3 per day**.
3. Ensure JSON is properly formatted and valid.
4. If data is unavailable, return an empty array [] or null.`;

        const fetchItinerary = async () => {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().replace(/```json|```/g, "").trim();
        };

        const fetchHotels = async () => {
            const coordinates = await fetchCoordinates(formData.destination);
            if (!coordinates) {
                console.error("Could not fetch coordinates.");
                return [];
            }
        
            const { latitude, longitude } = coordinates;
            const url = `https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates?page_number=0&locale=en-gb&longitude=${longitude}&checkout_date=${checkoutDate}&latitude=${latitude}&room_number=1&include_adjacency=true&filter_by_currency=INR&checkin_date=${checkinDate}&order_by=popularity&children_ages=5%2C0&categories_filter_ids=class%3A%3A5%2Cfree_cancellation%3A%3A1&units=metric&children_number=2&adults_number=2`;
            
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com'
                }
            };
        
            try {
                const response = await fetch(url, options);
                const result = await response.json();  // ✅ Convert response to JSON
                console.log(result.result);
                return result.result || []; // ✅ Ensure an array is returned
            } catch (error) {
                console.error("Error fetching hotels:", error);
                return [];
            }
        };
        

        const [itineraryResponse, hotels] = await Promise.all([fetchItinerary(), fetchHotels()]);

        let parsedItinerary;
        try {
            parsedItinerary = JSON.parse(itineraryResponse);
        } catch (error) {
            console.error("Invalid itinerary JSON:", error);
            return;
        }

        parsedItinerary.hotels = hotels.map(hotel => ({
            name: hotel.hotel_name,
            location: `${hotel.city}, ${hotel.country_trans}`,
            price: hotel.price_breakdown.all_inclusive_price || "N/A",
            rating: hotel.review_score || "N/A",
            amenities: hotel.is_free_cancellable ? ["Free Cancellation"] : [],
            image: hotel.main_photo_url || "https://picsum.photos/200",
        }));

        localStorage.setItem("generatedItinerary", JSON.stringify(parsedItinerary));

        navigate("/itinerary");

    } catch (error) {
        console.error("Error generating itinerary:", error);
    } finally {
        setIsLoading(false);
    }
};

export default generateItinerary;
