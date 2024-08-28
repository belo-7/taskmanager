import React, { useState } from "react";

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Python Coding", completed: false },
    { id: 2, name: "Java Coding", completed: false },
    { id: 3, name: "React Hooks", completed: false },
    { id: 4, name: "Task manager work", completed: false },
  ]);

  const [taskName, setTaskName] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (taskName) {
      setTasks([
        ...tasks,
        { id: Date.now(), name: taskName, completed: false },
      ]);
      setTaskName("");
    }
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setTaskName(taskToEdit.name);
    setEditTaskId(id);
  };

  const updateTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTaskId ? { ...task, name: taskName } : task
      )
    );
    setTaskName("");
    setEditTaskId(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const sortTasks = (status) => {
    setFilter(status);
  };

  const filteredTasks = () => {
    if (filter === "completed") return tasks.filter((task) => task.completed);
    if (filter === "uncompleted")
      return tasks.filter((task) => !task.completed);
    return tasks;
  };

  return (
    <div className=" flex-1 w-full h-full px-40 py-20 bg-white rounded-3xl border-2 border-gray-200 ml-40  min-h-screen justify-center">
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
        {editTaskId ? "Update Task" : "Add Task"}
      </button>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => sortTasks("completed")}
          className="w-1/3 bg-green-600 text-white rounded-md p-2"
        >
          Complete all tasks
        </button>
        <button
          onClick={removeCompletedTasks}
          className="w-1/3 bg-red-600 text-white rounded-md p-2"
        >
          Remove comp tasks
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Tasks</h2>
        {filteredTasks().map((task) => (
          <div key={task.id} className="flex items-center justify-between">
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
            onChange={(e) => sortTasks(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
          </select>
        </div>
      </div>

      <div className="text-center flex gap-4  justify-center">
        <p className="">
          Completed: {tasks.filter((task) => task.completed).length}
        </p>
        <p> Total Tasks: {tasks.length}</p>
      </div>
    </div>
  );
};

export default TaskManager;
