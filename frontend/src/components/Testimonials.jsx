const testimonials = [
  {
    name: "David Jordan",
    role: "Digital nomad",
    text: "Travel AI saves time and stress by aiding travel planning, relieving indecision or uncertainty.",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    name: "Tushar",
    role: "Student",
    text: "Travel AI offers diverse planning options in a user-friendly interface. Simplifies travel planning for enthusiasts.",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Steve J",
    role: "Student",
    text: "I love traveling but hate planning. This app quickly organizes trip agendas, reducing decision fatigue.",
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
            <h3>{testimonial.name}</h3>
            <p className="role">{testimonial.role}</p>
            <p className="text">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;