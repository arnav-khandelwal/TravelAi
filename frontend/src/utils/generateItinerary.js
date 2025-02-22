import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from "react-router-dom";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


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

    setIsLoading(true);
    try {
        const prompt = `Plan a detailed travel itinerary for:
        - Destination: ${formData.destination}
        - Travel dates: ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}
        - Budget: ${formData.budget.label}
        - Travel Style: ${formData.travelStyle.label}
        - Format the response as a valid JSON`;

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
                return;
            }
        
            const { latitude, longitude } = coordinates;
            const url = `https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates?page_number=0&locale=en-gb&longitude=${longitude}&checkout_date=${formData.endDate}&latitude=${latitude}&room_number=1&include_adjacency=true&filter_by_currency=INR&checkin_date=${formData.startDate}&order_by=price&children_ages=5%2C0&categories_filter_ids=class%4free_cancellation%3A%3A1&units=metric&children_number=2&adults_number=2`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '1786cdd64amsh13b957631cdacbep1a686ajsn52eef2f02006',
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.error(error);
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
            name: hotel.hotelName,
            location: `${hotel.city}, ${hotel.country}`,
            price: hotel.priceBreakdown?.grossPrice?.value || "N/A",
            rating: hotel.reviewScore || "N/A",
            amenities: hotel.isFreeCancellable ? ["Free Cancellation"] : [],
            image: hotel.photoMainUrl || "https://picsum.photos/200",
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
