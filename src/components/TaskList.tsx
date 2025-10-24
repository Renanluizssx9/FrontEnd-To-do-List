import React, { useState } from "react";
import "./TaskListItem.css";
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface Props {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

const TaskList: React.FC<Props> = ({ tasks, onToggleComplete, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const saveEdit = (id: string) => {
    if (editText.trim() === "") return;
    onEdit(id, editText);
    setEditingId(null);
  };

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id)}
          />
          
          {editingId === task._id ? (
            <>
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
                <div className="task-buttons">
              <button onClick={() => saveEdit(task._id)}>💾 Salvar</button>
              <button onClick={() => setEditingId(null)}>❌ Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                {task.title}
              </span>
              <div className="task-buttons">
              <button onClick={() => startEditing(task)}>✏️ Editar</button>
              <button onClick={() => onDelete(task._id)}>🗑️ Deletar</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
