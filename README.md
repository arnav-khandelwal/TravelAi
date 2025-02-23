# TravelAI 🌍✈️

TravelAI is an intelligent travel planning platform that simplifies your journey planning by integrating multiple services into a single, cohesive experience. From flights and hotels to activities and weather forecasts, TravelAI handles all aspects of your trip planning with AI-powered assistance.

## 🌟 Features

- **AI-Powered Itinerary Generation**: Personalized travel plans created using Google Gemini AI
- **Smart Chatbot Assistant**: Get instant help with your travel queries
- **Comprehensive Booking System**:
  - Flight bookings with competitive prices
  - Hotel reservations worldwide
  - Local activities and attractions
- **Real-time Weather Updates**: Plan according to destination weather
- **All-in-One Itinerary**: Keep all your bookings organized in one place

## 🛠️ Tech Stack

- **Frontend**: React
- **APIs Used**:

| Use Case | API |
|----------|-----|
| Itinerary Generation | Google Gemini |
| Chatbot | Google Gemini |
| Hotels | Booking.com |
| Weather | OpenWeatherMap |
| Flights | SkyScanner 3 + OpenWeatherMap |

## Future Developments

- **Integrated Payment System**: Using Razorpay's one-to-many model to split payment and book through multiple vendors in a single go.
- **Enhanced Personalization**: Utilizing user's previous prompts for better future plan generation.
- **Editable Bookings**: Users will be able to edit hotel and flight parameters using an edit button.
- **User Dashboard**: A dashboard will be created where users can see their past trips planned, current and past bookings, and payment receipts.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for:
  - Google Gemini
  - Booking.com
  - OpenWeatherMap
  - SkyScanner 3

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/travelai.git
cd travelai
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_RAPID_API_KEY=YOUR_RAPID_API_KEY
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

4. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

## 📖 Usage

1. **Plan Your Trip**:
   - Enter your destination and travel dates
   - Let our AI generate a personalized itinerary

2. **Book Services**:
   - Search and book flights
   - Find and reserve hotels
   - Discover and book local activities

3. **Get Support**:
   - Use the AI chatbot for instant assistance
   - Check weather forecasts for better planning
   - View and manage all bookings in one place

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Arnav Khandelwal - [arnav-khandelwal](https://github.com/arnav-khandelwal)
- Aryan Kushwaha - [aryanj33](https://github.com/aryanj33)
- Janvi Gupta - [janviii09](https://github.com/janviii09)

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Booking.com for hotel data
- OpenWeatherMap for weather information
- SkyScanner for flight details
