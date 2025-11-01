import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useAuth } from "./components/AuthContext";
import {
  DeleteAccountModal,
  SessionExpiredModal,
} from "./components/modals/Modals";
import "./App.css";

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
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(true);
  };

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
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching tasks:", error);
          if (error.response?.status === 401) {
            handleSessionExpired();
          }
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding task:", error);
        if (error.response?.status === 401) {
          handleSessionExpired();
        }
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
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? response.data : t))
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating task:", error);
        if (error.response?.status === 401) {
          handleSessionExpired();
        }
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting task:", error);
        if (error.response?.status === 401) {
          handleSessionExpired();
        }
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
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? response.data : t))
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error editing task:", error);
        if (error.response?.status === 401) {
          handleSessionExpired();
        }
      }
    }
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
        logout();
        window.location.href = "/login";
      } else {
        alert("Error deleting account.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting account:", error);
        alert("Server connection error.");
        logout();
        window.location.href = "/login";
      }
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
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
          <button
            className="delete-account-button"
            onClick={confirmDeleteAccount}
          >
            Delete account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showSessionExpiredModal && (
        <SessionExpiredModal
          onConfirm={() => {
            setShowSessionExpiredModal(false);
            logout();
            window.location.href = "/login";
          }}
        />
      )}
    </div>
  );
};

export default App;
