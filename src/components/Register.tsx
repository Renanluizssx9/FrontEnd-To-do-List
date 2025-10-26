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

      setMessage("✅ Usuário registrado com sucesso!");
      localStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || "Erro ao registrar");
      } else {
        setMessage("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Criar Conta</h2>
      <form className="register-form" onSubmit={handleRegister}>
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
        <button type="submit">Registrar</button>
      </form>

      <button className="secondary-button" onClick={() => navigate("/login")}>
        Entrar agora
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
