"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

// Define task type
export interface Task {
  id: string
  icon: string
  title: string
  points: number
  message: string
  progress: number
}

// Define context type
interface TaskContextType {
  tasks: Task[]
  completedTasks: Task[]
  completeTask: (id: string) => void
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    icon: "/images/pixel-broom.png",
    title: "Clean Room!",
    points: 5,
    message: "Make your bed and pick up toys",
    progress: 75,
  },
  {
    id: "2",
    icon: "/images/pixel-book.png",
    title: "Read Book",
    points: 3,
    message: "Read for 20 minutes",
    progress: 50,
  },
  {
    id: "3",
    icon: "/images/pixel-dish.png",
    title: "Help with Dishes",
    points: 4,
    message: "Clear the table after dinner",
    progress: 0,
  },
  {
    id: "4",
    icon: "/images/pixel-toothbrush.png",
    title: "Brush Teeth",
    points: 2,
    message: "Morning and night!",
    progress: 100,
  },
]

// Provider component
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])

  // Function to complete a task
  const completeTask = (id: string) => {
    const taskToComplete = tasks.find((task) => task.id === id)

    if (taskToComplete) {
      // Remove from tasks
      setTasks(tasks.filter((task) => task.id !== id))

      // Add to completed tasks
      setCompletedTasks([...completedTasks, { ...taskToComplete, progress: 100 }])
    }
  }

  return <TaskContext.Provider value={{ tasks, completedTasks, completeTask }}>{children}</TaskContext.Provider>
}

// Hook to use the task context
export function useTaskStore() {
  const context = useContext(TaskContext)

  if (context === undefined) {
    throw new Error("useTaskStore must be used within a TaskProvider")
  }

  return context
}
