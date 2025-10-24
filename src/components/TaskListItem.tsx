import React from "react";
import "./TaskListItem.css";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface TaskListItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task._id)}
      />

      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.title}
      </span>

      <button
        className="task-list-item-button"
        onClick={() => onDelete(task._id)} 
      >
        Delete
      </button>
    </div>
  );
};

export default TaskListItem;
