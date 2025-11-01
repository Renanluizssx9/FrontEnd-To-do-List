import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });

      setMessage("✅ User registered successfully!");
      localStorage.setItem("token", response.data.token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || "Error during registration.");
      } else {
        setMessage("Failed to connect to the server.");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Create account</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      <button className="secondary-button" onClick={() => navigate("/login")}>
        Login now
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
