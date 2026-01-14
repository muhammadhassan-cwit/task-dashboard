"use client";

import { useState, useEffect, useMemo } from "react";

interface Task {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Completed">("All");

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("task-dashboard-data");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("task-dashboard-data", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = filterPriority === "All" || task.priority === filterPriority;

      const matchesStatus = 
        filterStatus === "All" ||
        (filterStatus === "Completed" && task.completed) ||
        (filterStatus === "Pending" && !task.completed);

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, filterPriority, filterStatus]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTask,
      priority,
      dueDate,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setDueDate("");
    setPriority("Medium");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: string) => {
    if (p === "High") return "text-red-500 font-bold";
    if (p === "Medium") return "text-yellow-500 font-medium";
    return "text-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">
        My Tasks
      </h1>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Add New Task</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select
            className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="w-full md:w-auto p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <select 
            className="flex-1 md:flex-none p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            {tasks.length === 0 ? "No tasks yet. Add one above!" : "No tasks match your filters."}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all duration-200 ${
                task.completed 
                  ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-slate-300 dark:border-slate-500 hover:border-green-500"
                  }`}
                >
                  {task.completed && "✓"}
                </button>
                
                <div>
                  <h3 className={`font-medium text-lg ${
                    task.completed 
                      ? "text-slate-500 dark:text-slate-500 line-through" 
                      : "text-slate-800 dark:text-slate-100"
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm mt-1">
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-slate-500 dark:text-slate-400">
                        Due: {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                aria-label="Delete task"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}