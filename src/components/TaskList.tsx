import React, { useState } from "react";
import "./TaskList.css";

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

const TaskList: React.FC<Props> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
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
      {tasks.map((task) => (
        <li key={task._id}>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task._id)}
            />

            {editingId === task._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span className={task.completed ? "completed" : ""}>
                {task.title}
              </span>
            )}
          </div>

          <div className="task-buttons">
            {editingId === task._id ? (
              <>
                <button onClick={() => saveEdit(task._id)}>💾 Save</button>
                <button onClick={() => setEditingId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEditing(task)}>✏️ Edit</button>
                <button onClick={() => onDelete(task._id)}>🗑️ Delete</button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
