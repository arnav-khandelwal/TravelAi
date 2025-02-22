import { motion } from 'framer-motion';

const journeys = [
  {
    id: 1,
    title: "Trip to Tokyo",
    description: "Join me on an exciting 10-day journey through Tokyo, where we'll visit iconic landmarks, indulge in delicious local cuisine, and immerse ourselves in Japanese culture.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=171&q=80",
    author: {
      name: "Ivanner Mora",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 2,
    title: "Trip to New York",
    description: "Experience the best of New York City in just 7 days! Explore iconic landmarks, indulge in delicious meals, and immerse yourself in the city's vibrant culture.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    author: {
      name: "Pablo Guzman",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  },
  {
    id: 3,
    title: "Trip to Paris",
    description: "Discover the magic of Paris in this comprehensive 5-day itinerary. From the Eiffel Tower to hidden cafes, experience the best of the City of Light.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    author: {
      name: "Marie Laurent",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  }
];

const JourneyCards = () => {
  return (
    <div className="journey-grid">
      {journeys.map((journey, index) => (
        <motion.div
          key={journey.id}
          className="journey-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <img src={journey.image} alt={journey.title} className="journey-image" />
          <div className="journey-content">
            <h3>{journey.title}</h3>
            <p>{journey.description}</p>
            <div className="journey-author">
              <img src={journey.author.avatar} alt={journey.author.name} className="author-avatar" />
              <span>{journey.author.name}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default JourneyCards;