import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
const API_URL = import.meta.env.VITE_API_URL;
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };
    fetchTasks();
  }, []);
  const handleAddTask = async (title: string) => {
    if (title.trim() === "") return;
    try {
      const response = await axios.post(API_URL, { title });
      setTasks(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };
  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    try {
      const response = await axios.put(`${API_URL}/${taskId}`, {
        completed: !task.completed,
      });
      setTasks(prev => prev.map(t => (t._id === taskId ? response.data : t)));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };
  const handleEditTask = async (taskId: string, newTitle: string) => {
    if (newTitle.trim() === "") return;
    try {
      const response = await axios.put(`${API_URL}/${taskId}`, { title: newTitle });
      setTasks(prev => prev.map(t => (t._id === taskId ? response.data : t)));
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const incompleteTasks = totalTasks - completedTasks;

  return (
    <div className="container">
      <h1 className="title">Trade to World Task List</h1>
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
      </div>
    </div>
  );
};

export default App;
