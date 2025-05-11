"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TaskCard from "@/components/task-card"
import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import { useTaskStore } from "@/lib/task-store"

export default function HomePage() {
  const { tasks, completedTasks } = useTaskStore()
  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo")

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title={`Hi! ${name}`} icon="/images/boy.png" />

      <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-arcade text-2xl text-purple-800">MY QUESTS</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`border-2 font-arcade ${
                activeTab === "todo"
                  ? "border-blue-300 bg-blue-100 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("todo")}
            >
              TO DO
            </Button>
            <Button
              variant="outline"
              className={`border-2 font-arcade ${
                activeTab === "done"
                  ? "border-green-300 bg-green-100 text-green-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
              onClick={() => setActiveTab("done")}
            >
              DONE
            </Button>
          </div>
        </div>

        {activeTab === "todo" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  points={task.points}
                  message={task.message}
                  progress={task.progress}
                />
              ))
            ) : (
              <div className="col-span-2 rounded-lg border-2 border-dashed border-purple-200 p-8 text-center">
                <img src="/images/duck.png" alt="No tasks" className="mx-auto mb-4 h-24 w-24" />
                <h3 className="mb-2 font-arcade text-lg text-purple-700">NO QUESTS YET!</h3>
                <p className="text-purple-600">All your quests are completed. Great job!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  icon={task.icon}
                  title={task.title}
                  points={task.points}
                  message={task.message}
                  progress={100}
                  completed
                />
              ))
            ) : (
              <div className="col-span-2 rounded-lg border-2 border-dashed border-purple-200 p-8 text-center">
                <img src="/images/duck.png" alt="No completed tasks" className="mx-auto mb-4 h-24 w-24" />
                <h3 className="mb-2 font-arcade text-lg text-purple-700">NO COMPLETED QUESTS</h3>
                <p className="text-purple-600">Complete some quests to see them here!</p>
              </div>
            )}
          </div>
        )}
      </PixelatedContainer>
    </div>
  )
}
