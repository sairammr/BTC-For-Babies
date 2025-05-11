"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clipboard, Cog, Coins, Home, Plus, Users } from "lucide-react"
import TaskCard from "@/components/task-card"
import ChildProfile from "@/components/child-profile"
import SavingsVault from "@/components/savings-vault"
import NotificationBanner from "@/components/notification-banner"
import { useEffect, useState } from "react"
import AddTaskModal from "@/components/add-task-modal"
import AddChildModal from "@/components/add-child-modal"
import ConnectWalletModal from "@/components/connect-wallet-modal"
import TaskCardV2 from "@/components/ui/task-card-v2"
import ConnectWallet from "@/components/connectWallet"
import { connect ,getLocalStorage,disconnect} from '@stacks/connect';
import supabase from "@/tools/supabaseConfig"
import GetAccountDetails from "@/hooks/getAccountdetails"
import { generateWallet, generateSecretKey, generateNewAccount, getStxAddress } from '@stacks/wallet-sdk';

interface Child {
  id: string;
  name: string;
  tasksCompleted: number;
  totalRewards: number;
  walletAddress: string;
}

export default function Dashboard() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddChild, setShowAddChild] = useState(false)
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [tasks, setTasks] = useState([])
  const [children, setChildren] = useState<Child[]>([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [notifications, setNotifications] = useState([
    { id: "notif-1", message: "Task completed by Emma!", type: "success" as const },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('children')
          .select('*')
        
        if (error) {
          throw error
        }

        if (data) {
          // Map the data to match the expected format
          const formattedChildren = data.map(child => ({
            id: child.id,
            name: child.child_name || '',
            tasksCompleted:0,
            totalRewards: 0,
            walletAddress: child.child_wallet || ''
          }))
          setChildren(formattedChildren)
        }
      } catch (error) {
        console.error('Error fetching children:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChildren()
  }, [])

  // Add a new task
  const handleAddTask = (newTask: {
    title: string;
    description: string;
    child: string;
    reward: number;
    icon: string;
  }) => {
    const taskWithId = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "pending",
    }
    setTasks([...tasks, taskWithId])

    // Add notification
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        message: `New task "${newTask.title}" created for ${newTask.child}!`,
        type: "success",
      },
      ...notifications,
    ])
  }

  



  // Add a new child
  const handleAddChild = async (newChild: {
    name: string;
    age: number;
    password: string;
  }) => {
    try {
      const parentWallet = GetAccountDetails() || "";



      async function createWallet(){
        
        const secretKey = generateSecretKey();
      
        let wallet = await generateWallet({
          secretKey,
          password: newChild.password,
        });
        const account = wallet.accounts[0]; 
        // Get the address from the private key
        const testnetAddress = getStxAddress(account, 'testnet');
        // console.log('private key', account.stxPrivateKey);
        // console.log('Wallet Address:', testnetAddress);
        // console.log('Wallet Details:', wallet.accounts[0]);
        return testnetAddress;
      }
      

      const { data, error } = await supabase
        .from('children')
        .insert([{
          child_name: newChild.name,
          age: newChild.age,
          parent_wallet: parentWallet,
          child_wallet: await createWallet()
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error.message)
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert')
      }

      // Format and add the new child directly
      const newFormattedChild: Child = {
        id: data[0].id,
        name: data[0].child_name,
        tasksCompleted: 0,
        totalRewards: 0,
        walletAddress: data[0].child_wallet || ''
      }

      setChildren(prev => [...prev, newFormattedChild])
      setShowAddChild(false)
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `${newChild.name} added to your family!`,
          type: "success",
        },
        ...notifications,
      ])
    } catch (error) {
      console.error('Error adding child:', error)
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: "Failed to add child. Please try again.",
          type: "error",
        },
        ...notifications,
      ])
    }
  }

  // Update task
    const handleUpdateTask = (updatedTask: {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    child: string;
    reward: number;
    icon: string;
  }) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)))
  }

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))

    // Add notification
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        message: "Task deleted successfully",
        type: "success",
      },
      ...notifications,
    ])
  }
const handleWalletDisconnect = () => {
  setIsWalletConnected(false)
  disconnect()
}
  // Handle wallet connection
  const handleWalletConnect = () => {
    setIsWalletConnected(true)
    connect()
    const userData = getLocalStorage();
    const walletAddr = userData?.addresses?.stx?.[0]?.address || '';
    setWalletAddress(walletAddr);

    // Add notification
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        message: "Wallet connected successfully!",
        type: "success",
      },
      ...notifications,
    ])
  }

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0zNiA0djRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bS04IDB2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tMzIgMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tMzIgMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tMzIgMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bS04IDB2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHoiIGZpbGw9IiNGOEM2RDIiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 bg-gradient-to-br from-[#FFF4C9] to-[#F8C6D2] rounded-lg p-1.5">
            <PixelatedLogo />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#4B5563] to-[#F59E0B] bg-clip-text text-transparent">
            BTC for Babies
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="relative p-2 hover:bg-[#F5F5F5] rounded-full transition-colors">
              <Bell className="w-6 h-6 text-[#4B5563]" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F8C6D2] rounded-full"></span>
              )}
            </button>
          </div>

          <Button className={`${
              isWalletConnected ? "bg-[#C4E4D2] hover:bg-[#C4E4D2]/80" : "bg-[#FFF4C9] hover:bg-[#FFF4C9]/80"
            } text-[#4B5563] hidden md:flex transition-all duration-300 shadow-sm`} onClick={() => handleWalletConnect()}><Coins className="w-4 h-4 mr-2" />
            {isWalletConnected ? (
              
              <span className="font-mono text-xs" onClick={() => handleWalletDisconnect()}>
                {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            ) : (
              "Connect Wallet"
            )}</Button> 
          

            
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Notifications */}
        <div className="space-y-2 mb-6">
          {notifications.map((notification) => (
            <NotificationBanner
              key={notification.id}
              id={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="tasks" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-6 bg-white shadow-sm border border-[#E5E7EB] p-1 rounded-xl">
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-[#F8C6D2] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger
              value="children"
              className="data-[state=active]:bg-[#C9E4FF] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Children</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-[#C4E4D2] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Coins className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#D9CFF3] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Clipboard className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#4B5563]">Tasks</h2>
              <Button
                className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563] shadow-sm transition-all duration-200 hover:shadow"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant="outline"
                className="bg-white border-[#F8C6D2] text-[#4B5563] hover:bg-[#F8C6D2]/10 shadow-sm"
              >
                All Tasks
              </Button>
              <Button
                variant="outline"
                className="bg-white border-[#C4E4D2] text-[#4B5563] hover:bg-[#C4E4D2]/10 shadow-sm"
              >
                Pending
              </Button>
              <Button
                variant="outline"
                className="bg-white border-[#D9CFF3] text-[#4B5563] hover:bg-[#D9CFF3]/10 shadow-sm"
              >
                Completed
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                  <Clipboard className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[#4B5563] font-medium mb-2">No tasks yet</h3>
                <p className="text-[#6B7280] text-sm mb-4">Create your first task to get started</p>
                <Button className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563]" onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCardV2
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status as "pending" | "completed"}
                    child={task.child}
                    reward={task.reward}
                    icon={task.icon as "Broom" | "BookOpen" | "Bone"}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#4B5563]">Children</h2>
              <Button
                className="bg-[#F8C6D2] hover:bg-[#F8C6D2]/80 text-[#4B5563] shadow-sm transition-all duration-200 hover:shadow"
                onClick={() => setShowAddChild(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading children...</p>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[#4B5563] font-medium mb-2">No children added</h3>
                <p className="text-[#6B7280] text-sm mb-4">Add your first child to get started</p>
                <Button
                  className="bg-[#F8C6D2] hover:bg-[#F8C6D2]/80 text-[#4B5563]"
                  onClick={() => setShowAddChild(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {children.map((child) => (
                  <ChildProfile
                    key={child.id}
                    name={child.name}
                    tasksCompleted={child.tasksCompleted}
                    totalRewards={child.totalRewards}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <h2 className="text-xl font-bold text-[#4B5563]">Rewards</h2>
            {children.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[#4B5563] font-medium mb-2">No rewards yet</h3>
                <p className="text-[#6B7280] text-sm mb-4">Add children and complete tasks to see rewards</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {children.map((child) => (
                    <SavingsVault key={child.id} childName={child.name} balance={child.totalRewards} />
                  ))}
                </div>
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-[#4B5563] mb-2">Transaction History</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 px-3 bg-white rounded border border-[#E5E7EB]">
                        <div>
                          <p className="text-[#4B5563]">0.002 BTC approved for Homework</p>
                          <p className="text-xs text-[#6B7280]">Emma • Today, 3:45 PM</p>
                        </div>
                        <Badge className="bg-[#C4E4D2] text-[#4B5563] hover:bg-[#C4E4D2]">Approved</Badge>
                      </div>
                      <div className="flex justify-between py-2 px-3 bg-[#F5F5F5] rounded border border-[#E5E7EB]">
                        <div>
                          <p className="text-[#4B5563]">0.001 BTC approved for Dishes</p>
                          <p className="text-xs text-[#6B7280]">Jack • Yesterday, 6:20 PM</p>
                        </div>
                        <Badge className="bg-[#C4E4D2] text-[#4B5563] hover:bg-[#C4E4D2]">Approved</Badge>
                      </div>
                      <div className="flex justify-between py-2 px-3 bg-white rounded border border-[#E5E7EB]">
                        <div>
                          <p className="text-[#4B5563]">0.0005 BTC approved for Pet Care</p>
                          <p className="text-xs text-[#6B7280]">Jack • Yesterday, 5:15 PM</p>
                        </div>
                        <Badge className="bg-[#C4E4D2] text-[#4B5563] hover:bg-[#C4E4D2]">Approved</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-bold text-[#4B5563]">Activity History</h2>
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3 py-2 border-b border-[#E5E7EB]">
                  <div className="bg-[#F8C6D2] rounded-full p-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#4B5563]" />
                  </div>
                  <div>
                    <p className="text-[#4B5563] font-medium">Emma completed "Homework"</p>
                    <p className="text-xs text-[#6B7280]">Today, 3:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2 border-b border-[#E5E7EB]">
                  <div className="bg-[#C4E4D2] rounded-full p-2 mt-1">
                    <Coins className="w-4 h-4 text-[#4B5563]" />
                  </div>
                  <div>
                    <p className="text-[#4B5563] font-medium">0.002 BTC added to Emma's savings</p>
                    <p className="text-xs text-[#6B7280]">Today, 3:46 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2 border-b border-[#E5E7EB]">
                  <div className="bg-[#D9CFF3] rounded-full p-2 mt-1">
                    <Plus className="w-4 h-4 text-[#4B5563]" />
                  </div>
                  <div>
                    <p className="text-[#4B5563] font-medium">New task "Feed the dog" created for Jack</p>
                    <p className="text-xs text-[#6B7280]">Today, 2:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} onAddTask={handleAddTask} children={children} />
      )}

      {showAddChild && <AddChildModal onClose={() => setShowAddChild(false)} onAddChild={handleAddChild} />}

   

      
    </div>
  )
}

function PixelatedLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="8" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="12" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="16" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="20" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="24" y="4" width="4" height="4" fill="#F8C6D2" />
      <rect x="4" y="8" width="4" height="4" fill="#F8C6D2" />
      <rect x="24" y="8" width="4" height="4" fill="#F8C6D2" />
      <rect x="4" y="12" width="4" height="4" fill="#C4E4D2" />
      <rect x="12" y="12" width="4" height="4" fill="#C4E4D2" />
      <rect x="16" y="12" width="4" height="4" fill="#C4E4D2" />
      <rect x="24" y="12" width="4" height="4" fill="#C4E4D2" />
      <rect x="4" y="16" width="4" height="4" fill="#C4E4D2" />
      <rect x="24" y="16" width="4" height="4" fill="#C4E4D2" />
      <rect x="4" y="20" width="4" height="4" fill="#C9E4FF" />
      <rect x="8" y="20" width="4" height="4" fill="#C9E4FF" />
      <rect x="12" y="20" width="4" height="4" fill="#C9E4FF" />
      <rect x="16" y="20" width="4" height="4" fill="#C9E4FF" />
      <rect x="20" y="20" width="4" height="4" fill="#C9E4FF" />
      <rect x="24" y="20" width="4" height="4" fill="#C9E4FF" />
    </svg>
  )
}
