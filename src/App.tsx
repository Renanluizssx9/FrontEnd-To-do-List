import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;
const DELETE_URL = `${import.meta.env.VITE_API_URL}/auth/delete`;

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar tarefas:", error);
        if (error.response?.status === 401) {
          alert("Sessão expirada ou conta não existe mais.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async (title: string) => {
    if (!title.trim() || !token) return;

    try {
      const response = await axios.post(
        API_URL,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => [...prev, response.data]);
    } catch (error: any) {
      console.error("Erro ao adicionar tarefa:", error);
      if (error.response?.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task || !token) return;

    try {
      const response = await axios.put(
        `${API_URL}/${taskId}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t._id === taskId ? response.data : t)));
    } catch (error: any) {
      console.error("Erro ao atualizar tarefa:", error);
      if (error.response?.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error: any) {
      console.error("Erro ao excluir tarefa:", error);
      if (error.response?.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleEditTask = async (taskId: string, newTitle: string) => {
    if (!newTitle.trim() || !token) return;

    try {
      const response = await axios.put(
        `${API_URL}/${taskId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t._id === taskId ? response.data : t)));
    } catch (error: any) {
      console.error("Erro ao editar tarefa:", error);
      if (error.response?.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(DELETE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Conta excluída com sucesso.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro de conexão com o servidor.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const incompleteTasks = totalTasks - completedTasks;

  return (
    <div className="container">
      <h1 className="title">To do List</h1>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />
      <div className="task-stats">
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Incomplete Tasks: {incompleteTasks}</p>
        <div className="logout-and-delte-button">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <button className="delete-account-button" onClick={confirmDeleteAccount}>
            Delete account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Tem certeza que deseja excluir sua conta? Essa ação é irreversível.</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteAccount} className="confirm-button">Confirmar</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
