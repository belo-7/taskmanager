import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch tasks from backend when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8082/Task")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // Add a new task
  const addTask = () => {
    if (taskName) {
      axios
        .post("http://localhost:8082/Task", { name: taskName })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setTaskName("");
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  };

  // Edit an existing task
  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setTaskName(taskToEdit.name);
    setEditTaskId(id);
  };

  // Update an existing task
  const updateTask = () => {
    axios
      .put(`http://localhost:8082/Task/${editTaskId}`, {
        name: taskName,
        completed: tasks.find((task) => task.id === editTaskId).completed,
      })
      .then((response) => {
        setTasks(
          tasks.map((task) => (task.id === editTaskId ? response.data : task))
        );
        setTaskName("");
        setEditTaskId(null);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8082/Task/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };


  const completeTask = (id) => {
    const taskToComplete = tasks.find((taskManager) => taskManager.id === id);
    axios
      .put(`http://localhost:8082/Task/${id}`, {
        name: taskToComplete.name,
        completed: !taskToComplete.completed,
      })
      .then((response) => {
        setTasks(
          tasks.map((taskManager) =>
            taskManager.id === id ? response.data : taskManager
          )
        );
      })
      .catch((error) => {
        console.error("Error completing task:", error);
      });
  };

  // Remove all completed tasks
  const removeCompletedTask = () => {
    axios
      .delete("http://localhost:8082/Task/completed")
      .then(() => {
        setTasks(tasks.filter((task) => !task.completed));
      })
      .catch((error) => {
        console.error("Error removing completed tasks:", error);
      });
  };

  // Filter tasks based on completion status
  const sortTask = (status) => {
    setFilter(status);
  };

  // Filtered tasks to display
  const filteredTask = () => {
    if (filter === "completed") return tasks.filter((task) => task.completed);
    if (filter === "uncompleted")
      return tasks.filter((task) => !task.completed);
    return tasks;
  };

  return (
    <div className="flex-1 w-full h-full px-40 py-20 bg-white rounded-3xl border-2 border-gray-200 ml-40 min-h-screen justify-center">
      <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
        placeholder="Add your task"
      />
      <button
        onClick={editTaskId ? updateTask : addTask}
        className="w-full bg-purple-600 text-white rounded-md p-2 mb-4"
      >
        {editTaskId ? "Save Changes" : "Add New Task"}
      </button>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => sortTask("completed")}
          className="w-1/3 bg-green-600 text-white rounded-md p-2"
        >
          Completed Tasks
        </button>
        <button
          onClick={removeCompletedTask}
          className="w-1/3 bg-red-600 text-white rounded-md p-2"
        >
          Remove Completed
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Tasks</h2>
        {filteredTask().map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => completeTask(task.id)}
                className="mr-2"
              />
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.name}
              </span>
            </div>
            <div>
              <button
                onClick={() => editTask(task.id)}
                className="text-blue-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Sort by:</span>
        <div className="relative">
          <select
            onChange={(e) => sortTask(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
          </select>
        </div>
      </div>

      <div className="text-center flex gap-4 justify-center">
        <p>Completed: {tasks.filter((task) => task.completed).length}</p>
        <p>Total Tasks: {tasks.length}</p>
      </div>
    </div>
  );
};

export default Task;
