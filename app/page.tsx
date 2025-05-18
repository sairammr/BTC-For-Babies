"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import supabase from "@/tools/supabaseConfig"

interface Task {
  tid: number
  id: number
  title: string
  description: string
  status: string
  reward: number
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo")
  const router = useRouter()

  const fetchTasks = async (childName: string) => {
    try {
      // First get the child's ID from their name
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id')
        .eq('child_name', childName)
        .single()

      if (childError) {
        console.error('Error fetching child:', childError)
        return
      }

      if (!childData) {
        console.error('Child not found')
        return
      }

      // Then fetch tasks for this child
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', childData.id)

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError)
        return
      }

      setTasks(tasksData || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username')
    if (!storedUsername) {
      router.push('/login')
      return
    }
    setUsername(storedUsername)
    fetchTasks(storedUsername)
  }, [router])

  const handleSubmitForReview = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'submitted' })
        .eq('tid', taskId)

      if (error) {
        console.error('Error updating task:', error)
        return
      }

      // Refresh tasks after update
      const storedUsername = localStorage.getItem('username')
      if (storedUsername) {
        fetchTasks(storedUsername)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const pendingTasks = tasks.filter(task => task.status === 'assigned')
  const submittedTasks = tasks.filter(task => task.status === 'submitted')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title={`Hi! ${username}`} icon="/images/boy.png" />

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
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div
                  key={task.tid}
                  className="rounded-lg border-2 border-purple-200 bg-white p-4"
                >
                  <h3 className="mb-2 font-arcade text-lg text-purple-700">{task.title}</h3>
                  <p className="mb-4 text-purple-600">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-arcade text-purple-500">Reward: {task.reward} points</span>
                    <Button
                      className="bg-purple-500 font-arcade text-white hover:bg-purple-600"
                      onClick={() => handleSubmitForReview(task.tid)}
                    >
                      SUBMIT FOR REVIEW
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 rounded-lg border-2 border-dashed border-purple-200 p-8 text-center">
                <img src="/images/duck.png" alt="No tasks" className="mx-auto mb-4 h-24 w-24" />
                <h3 className="mb-2 font-arcade text-lg text-purple-700">NO QUESTS YET!</h3>
                <p className="text-purple-600">All your quests are completed. Great job!</p>
              </div>
            )}

            {submittedTasks.length > 0 && (
              <>
                <div className="col-span-2 mt-8">
                  <h3 className="mb-4 font-arcade text-xl text-blue-700">SUBMITTED FOR REVIEW</h3>
                </div>
                {submittedTasks.map((task) => (
                  <div
                    key={task.tid}
                    className="rounded-lg border-2 border-blue-200 bg-white p-4"
                  >
                    <h3 className="mb-2 font-arcade text-lg text-blue-700">{task.title}</h3>
                    <p className="mb-4 text-blue-600">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-arcade text-blue-500">Reward: {task.reward} points</span>
                      <span className="font-arcade text-blue-500">PENDING REVIEW</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div
                  key={task.tid}
                  className="rounded-lg border-2 border-green-200 bg-white p-4"
                >
                  <h3 className="mb-2 font-arcade text-lg text-green-700">{task.title}</h3>
                  <p className="mb-4 text-green-600">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-arcade text-green-500">Reward: {task.reward} points</span>
                    <span className="font-arcade text-green-500">COMPLETED!</span>
                  </div>
                </div>
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
