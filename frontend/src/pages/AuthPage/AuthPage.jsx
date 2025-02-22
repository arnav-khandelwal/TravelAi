import React, { useState } from "react";
import "./AuthPage.css"; // Import the external CSS file

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth-page">
        <div className="auth-container">
        <div className="auth-box">
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form>
            {isSignUp && <input type="text" placeholder="Full Name" required />}
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            {isSignUp && <input type="password" placeholder="Confirm Password" required />}
            <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
            </form>
            <p onClick={toggleForm} className="toggle-link">
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </p>
        </div>
        </div>
    </div>    
  );
};

export default AuthPage;
