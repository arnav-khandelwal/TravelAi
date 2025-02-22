import { FaRoute, FaUserCog, FaUtensils } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="features">
      <div className="feature-card">
        <FaRoute className="feature-icon" />
        <h3>Optimal Route Planning</h3>
        <p>Our AI algorithms analyze your preferences to craft the most efficient route, saving you time and effort.</p>
      </div>
      <div className="feature-card">
        <FaUserCog className="feature-icon" />
        <h3>Personalize Your Adventure</h3>
        <p>Shape your journey by freely adding, editing, or deleting activities from your itinerary.</p>
      </div>
      <div className="feature-card">
        <FaUtensils className="feature-icon" />
        <h3>Local Cuisine Recommendations</h3>
        <p>Discover local cuisines and hidden gems recommended by our AI, tailored to your taste buds.</p>
      </div>
    </section>
  );
};

export default Features;