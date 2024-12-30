import axios from "axios";
import { useState } from "react";

export default function TodoApp({ res }) {
  const [todos, setTodos] = useState(res.todos);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(0);

  const handleAddTodo = async () => {
    if (!newTitle.trim()) return;
    const response = await axios.post("/api/todos.json", {
      title: newTitle,
      description: newDescription,
    });
    if (response.success) {
      setTodos((prevTodos) => [...prevTodos, response.data]);
    } else {
      alert("Error adding todo");
    }
    setNewTitle("");
    setNewDescription("");
  };

  const handleToggleTodo = async (id) => {
    try {
      await axios.patch(`/api/todos/${id}.json`, null);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling the todo:", error);
    }
  };

  const handleUpdateTodo = async () => {
    try {
      if (!editId) return;

      await axios.put(`/api/todos/${editId}.json`, {
        title: newTitle,
        description: newDescription,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editId
            ? { ...todo, title: newTitle, description: newDescription }
            : todo
        )
      );

      setEditId(null);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error updating the todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}.json`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting the todo:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 drop-shadow-md">
        Todo App
      </h1>
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task Title"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task Description"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm"
          />
        </div>
        <button
          onClick={editId ? handleUpdateTodo : handleAddTodo}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>
      <ul className="space-y-6 max-w-2xl mx-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center transition duration-300 ${
              todo.completed ? "bg-gray-300" : "bg-white"
            } hover:shadow-md`}
          >
            <div>
              <h2
                className={`font-semibold text-lg ${
                  todo.completed
                    ? "line-through text-gray-600"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </h2>
              <p
                className={`${
                  todo.completed ? "text-gray-500" : "text-gray-700"
                }`}
              >
                {todo.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
              />
              <button
                onClick={() => {
                  setEditId(todo.id);
                  setNewTitle(todo.title);
                  setNewDescription(todo.description);
                }}
                className="text-sm px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
