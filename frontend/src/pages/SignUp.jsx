import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("All fields are required");
    }

    if (!formData.email.endsWith("@ufl.edu")) {
      return setError("Must use a UF email");
    }

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signup",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccess(response.data.message);
      
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      setError(error.response?.data?.message || "Error signing up");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <span className="auth-brand">GatorGrind</span>
          <h1>
            Join the campus
            <br />
            marketplace.
          </h1>
          <p>
            Create your account to discover <span className="auth-highlight">student-run businesses</span>, connect with trusted UF peers, and be part of a more convenient campus community.
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="auth-subtext">
              Sign up with your UF email to get started.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">UF Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your UF email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button className="auth-button" type="submit" >
                Create Account
              </button>
            </form>

            {error && <p className="auth-message error">{error}</p>}
            {success && <p className="auth-message success">{success}</p>}

            <p className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;