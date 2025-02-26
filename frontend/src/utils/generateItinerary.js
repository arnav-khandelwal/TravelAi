import { GoogleGenerativeAI } from "@google/generative-ai";

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

const fetchAirportSkyID = async (city) => {
    const apiKey = import.meta.env.VITE_RAPID_API_KEY;
    const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${city}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result?.data?.length > 0) {
            return result.data[0].presentation.skyId;
        }
        return null;
    } catch (error) {
        console.error("Error fetching airport SkyID:", error);
        return null;
    }
};

const fetchFlights = async (departureCity, destinationCity, departureDate) => {
    const apiKey = import.meta.env.VITE_RAPID_API_KEY;

    const fromSkyID = await fetchAirportSkyID(departureCity);
    const toSkyID = await fetchAirportSkyID(destinationCity);

    if (!fromSkyID || !toSkyID) {
        console.error("Could not fetch SkyIDs for flight search.");
        return [];
    }

    const url = `https://sky-scanner3.p.rapidapi.com/flights/search-one-way?fromEntityId=${fromSkyID}&toEntityId=${toSkyID}&departDate=${departureDate}&stops=direct&cabinClass=economy`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        
        if (result?.data?.itineraries?.length > 0) {
            return result.data.itineraries.slice(0, 3).map(flight => ({
                airline: flight.legs[0].carriers.marketing[0].name,
                departure: flight.legs[0].origin.id,
                arrival: flight.legs[0].destination.id,
                price: flight.price.formatted,
                depTime: flight.legs[0].departure,
                arrTime: flight.legs[0].arrival,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching flights:", error);
        return [];
    }
};


// ✅ Fetch weather from OpenWeather API instead of Gemini
const fetchWeather = async (city) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const coordinates = await fetchCoordinates(city);
    if (!coordinates) return null;

    const { latitude, longitude } = coordinates;

    try {
        // Fetch current weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        return {
            avgTemp: `${Math.round(weatherData.main.temp)}°C`,
            condition: weatherData.weather[0].description,
            rainChance: weatherData.rain ? `${weatherData.rain["1h"] || 0}%` : "0%",
            wind: `${weatherData.wind.speed} km/h`,
            humidity: `${weatherData.main.humidity}%`,
            packingTips: [
                "Comfortable shoes",
                weatherData.main.temp < 15 ? "Warm clothes " : "Light clothing ",
                weatherData.weather[0].main === "Rain" ? "Umbrella " : "Sunglasses ",
            ].filter(Boolean) // Remove empty values
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
};


const generateItinerary = async (formData, setIsLoading, navigate) => {
    if (!formData) return;

    const checkinDate = formatDate(formData.startDate);
    const checkoutDate = formatDate(formData.endDate);

    setIsLoading(true);
    try {

        const departureDate = new Date(formData.startDate);
        const returnDate = new Date(formData.endDate);

        const travelTimeHours = 0; 

        const travelDays = Math.ceil(travelTimeHours / 24);

        const totalDays = Math.max(
            (returnDate - departureDate) / (1000 * 60 * 60 * 24) + 1, // Trip duration in days
            travelDays + 1 // Ensure at least 1 full day
        );

        const prompt = `Plan a detailed travel itinerary for the following details. Ensure the response strictly follows the JSON structure below, but **keep it concise** to fit within 4000 characters:

                        - Destination: ${formData.destination}
                        - Departure city: ${formData.startLocation}
                        - Travel dates: ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}
                        - Budget: ${formData.budget.label}
                        - Travel Style: ${formData.travelStyle.label}
                        - Number of days: ${totalDays}

                        ### **Required JSON Structure**
                        {
                        "title": "Trip to ${formData.destination}",
                        "type": "Type of trip (solo, family, business, etc.)",
                        "purpose": "Purpose of the visit",
                        "days": [
                            ${Array.from({ length: totalDays }, (_, i) => `
                            {
                                "day": ${i + 1},
                                "activities": [
                                {
                                    "time": "09:00 AM",
                                    "activity": "Example Activity",
                                    "details": "Brief description (Max: 20 words)"
                                }
                                ]
                            }
                            `).join(",")}
                        ]
                        }

                        ### **Rules**
                        1. Keep the JSON response **under 4000 characters**.
                        2. Limit activities to **max 3 per day**.
                        3. Ensure JSON is properly formatted and valid.
                        4. If data is unavailable, return an empty array [] or null.
                        `;

        const fetchItinerary = async () => {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
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
                method: "GET",
                headers: {
                    "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
                    "x-rapidapi-host": "booking-com.p.rapidapi.com"
                }
            };
        
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                return result.result || [];
            } catch (error) {
                console.error("Error fetching hotels:", error);
                return [];
            }
        };
        const toDestination  = await fetchFlights(formData.startLocation, formData.destination, checkinDate);
        const fromDestination   = await fetchFlights(formData.startLocation, formData.destination, checkoutDate);
        const flights = {toDestination: toDestination, fromDestination: fromDestination};
        const [itineraryResponse, hotels, weather] = await Promise.all([
            fetchItinerary(),
            fetchHotels(),
            fetchWeather(formData.destination)
        ]);

        let parsedItinerary;
        try {
            parsedItinerary = JSON.parse(itineraryResponse);
        } catch (error) {
            console.error("Invalid itinerary JSON:", error);
            return;
        }

        parsedItinerary.weather = weather || {
            avgTemp: "N/A",
            condition: "N/A",
            rainChance: "N/A",
            wind: "N/A",
            humidity: "N/A",
            packingTips: []
        };

        parsedItinerary.hotels = hotels.map(hotel => ({
            name: hotel.hotel_name,
            location: `${hotel.city}, ${hotel.country_trans}`,
            currency: hotel.currency_code,
            price: hotel.price_breakdown.all_inclusive_price || "N/A",
            rating: hotel.review_score || "N/A",
            amenities: hotel.is_free_cancellable ? ["Free Cancellation"] : [],
            image: hotel.main_photo_url || "https://picsum.photos/200",
        }));

        parsedItinerary.flights = flights;

        localStorage.setItem("generatedItinerary", JSON.stringify(parsedItinerary));

        navigate("/itinerary");

    } catch (error) {
        console.error("Error generating itinerary:", error);
    } finally {
        setIsLoading(false);
    }
};

export default generateItinerary;
