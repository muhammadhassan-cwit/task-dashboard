"use client";

import { useState } from "react";
import { Task, Priority } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title,
      priority: priority,
      completed: false,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">My Tasks</h1>

      <form onSubmit={addTask} className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p>No tasks yet. Add one above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border ${task.completed ? "border-green-200 bg-green-50" : "border-slate-200"}`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
                
                <div>
                  <h3 className={`font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {task.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {task.priority}
                    </span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 px-3 py-1 text-sm hover:bg-red-50 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}