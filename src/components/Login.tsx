import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      setMessage("Redirecionando...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || "Erro ao fazer login");
      } else {
        setMessage("Erro de conexão com o servidor");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      <button className="secondary-button" onClick={() => navigate("/register")}>
        Criar uma conta
      </button>

      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
