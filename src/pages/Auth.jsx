import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css"; // Import CSS

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [regimentalNumber, setRegimentalNumber] = useState(""); // New state for regimental number
  const [school, setSchool] = useState(""); // New state for school
  const [unit, setUnit] = useState(""); // New state for unit
  const [group, setGroup] = useState(""); // New state for group
  const [directorate, setDirectorate] = useState(""); // New state for directorate
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Insert additional user details into the users table
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              name,
              email,
              regimental_number: regimentalNumber,
              school,
              unit,
              group,
              directorate,
            },
          ]);

        if (insertError) {
          setError(insertError.message);
        } else {
          setSuccessMessage("Check your email for verification!");
          // Optionally, redirect to a different page or keep the user on the same page
          // navigate("/Home");
        }
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate("/Home"); // Redirect after successful login
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">{isSignUp ? "Sign Up" : "Log In"}</h1>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div className="input-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>Regimental Number:</label>
                <input
                  type="text"
                  value={regimentalNumber}
                  onChange={(e) => setRegimentalNumber(e.target.value)}
                  required
                  placeholder="Enter your regimental number"
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>School:</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  placeholder="Enter your school"
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>Unit:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  placeholder="Enter your unit"
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>Group:</label>
                <input
                  type="text"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  required
                  placeholder="Enter your group"
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label>Directorate:</label>
                <input
                  type="text"
                  value={directorate}
                  onChange={(e) => setDirectorate(e.target.value)}
                  required
                  placeholder="Enter your directorate"
                  className="auth-input"
                />
              </div>
            </>
          )}
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="auth-input"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="auth-input"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="switch-auth">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="switch-button">
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;