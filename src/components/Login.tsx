import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // 👈 importa o contexto
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 pega a função do contexto

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      login(response.data.token); // 👈 salva o token via contexto
      setMessage("Redirecting...");
      setTimeout(() => {
        navigate("/"); // 👈 redireciona usando React Router
      }, 1000);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || "Login failed.");
      } else {
        setMessage("Failed to connect to the server.");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      <button
        className="secondary-button"
        onClick={() => navigate("/register")}
      >
        Create an account
      </button>

      {message && (
        <p
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
