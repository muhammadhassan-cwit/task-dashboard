"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "../../components/Layout/Modal";
import TaskForm from "../../components/Layout/TaskForm";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Completed">("All");

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

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.reduce(
      (acc, task) => {
        acc.total++;
        if (task.completed) acc.completed++;
        else acc.pending++;
        if (task.priority === "High") acc.high++;
        if (task.priority === "Medium") acc.medium++;
        if (task.priority === "Low") acc.low++;
        if (!task.completed && task.dueDate) {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          if (taskDate < today) acc.overdue++;
        }
        return acc;
      },
      { total: 0, completed: 0, pending: 0, high: 0, medium: 0, low: 0, overdue: 0 }
    );
  }, [tasks]);

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

  const handleAddTask = useCallback((title: string, priority: "Low" | "Medium" | "High", dueDate: string) => {
    const task: Task = {
      id: Date.now(),
      title,
      priority,
      dueDate,
      completed: false,
    };
    setTasks((prev) => [...prev, task]); 
    setIsModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // --- DRAG AND DROP HANDLERS (OPTIMIZED WITH useCallback) ---
  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move"; 
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (draggedTaskId === null || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, movedTask);

    setTasks(newTasks);
    setDraggedTaskId(null);
  }, [tasks, draggedTaskId]); // Dependencies: updates only when these change
  // -----------------------------------------------------------

  const getPriorityColor = (p: string) => {
    if (p === "High") return "text-red-500 font-bold";
    if (p === "Medium") return "text-yellow-500 font-medium";
    return "text-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            My Tasks
        </h1>
        <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
            + New Task
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 text-sm">Total Tasks</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {stats.total}
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Done)
              </span>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 text-sm">Overdue</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 text-sm">Status</div>
            <div className="flex gap-3 mt-1">
                <span className="text-orange-600 dark:text-orange-400 font-bold">{stats.pending} Active</span>
                <span className="text-slate-300">|</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{stats.completed} Done</span>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 text-sm">Priority</div>
            <div className="flex gap-2 mt-1 text-sm font-bold">
                <span className="text-red-500">{stats.high} High</span>
                <span className="text-yellow-500">{stats.medium} Medium</span>
                <span className="text-green-500">{stats.low} Low</span>
            </div>
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
            {tasks.length === 0 ? "No tasks yet. Click 'New Task' to start!" : "No tasks match your filters."}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
              className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all duration-200 cursor-move ${
                draggedTaskId === task.id ? "opacity-40 border-dashed border-blue-400" : ""
              } ${
                task.completed 
                  ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4 pointer-events-none"> 
                <button
                   onPointerDown={(e) => e.stopPropagation()} 
                   className="pointer-events-auto"
                >
                    <div 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                            task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-300 dark:border-slate-500 hover:border-green-500"
                        }`}
                    >
                    {task.completed && "✓"}
                    </div>
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
                className="text-slate-400 hover:text-red-500 transition-colors p-2 cursor-pointer pointer-events-auto"
                aria-label="Delete task"
                onPointerDown={(e) => e.stopPropagation()}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Create New Task"
      >
        <TaskForm 
            onAdd={handleAddTask} 
            onCancel={closeModal} 
        />
      </Modal>

    </div>
  );
}