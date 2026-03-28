import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      return setError("Email and password are required");
    }

    if (!formData.email.endsWith("@ufl.edu")) {
      return setError("Must use a UF email");
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccess(response.data.message);

      // redirect after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setError(error.response?.data?.message || "Error logging in");
    }
  }

  return (
    <div>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>UF Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your UF email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Log In</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;