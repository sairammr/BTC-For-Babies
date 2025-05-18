"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clipboard, Coins, Home, Plus, Users, X } from "lucide-react"
import NotificationBanner from "@/components/notification-banner"
import { useEffect, useState } from "react"
import AddTaskModal from "@/components/add-task-modal"
import AddChildModal from "@/components/add-child-modal"
import ConnectWalletModal from "@/components/connect-wallet-modal"
import TaskCardV2 from "@/components/ui/task-card-v2"
import supabase from "../../tools/supabaseConfig"
import { ethers } from 'ethers'
import taskRegistryABI from '../abi/taskRegistry.json'

// Contract address (from stacks-sample)
const TASK_REGISTRY_ADDRESS = '0x9404078DD16F12C7527215feEEcF4fF86F96DA3c';

import GetAccountDetails from "@/hooks/getAccountdetails"

interface Child {
  id: string;
  name: string;
  tasksCompleted: number;
  totalRewards: number;
  walletAddress: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "submitted" | "rejected";
  child: string;
  reward: number;
  icon: string;
  tid?: number;
}

// Update ExSat network configuration with exact details

export default function Dashboard() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddChild, setShowAddChild] = useState(false)
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  type NotificationType = "success" | "error";
  interface Notification {
    id: string;
    message: string;
    type: NotificationType;
  }
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "notif-1", message: "Task completed by Emma!", type: "success" },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [parentWallet, setParentWallet] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "review" | "completed">("all")
  const [activeTaskFilter, setActiveTaskFilter] = useState<"all" | "pending" | "completed" | "review">("all")

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
          const formattedChildren = data.map(child => ({
            id: child.id,
            name: child.child_name || '',
            tasksCompleted: 0,
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            children:children(id, child_name)
          `)
        
        if (error) {
          throw error
        }

        if (data) {
          const formattedTasks = data.map(task => ({
            id: `task-${task.tid}`,
            tid: task.tid,
            title: task.title,
            description: task.description,
            status: task.status === 'assigned' ? 'pending' : task.status,
            child: task.children?.child_name || '',
            reward: task.reward,
            icon: "Broom"
          }))
          setTasks(formattedTasks)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [])

  // Add this useEffect for wallet initialization
  useEffect(() => {
    const wallet = GetAccountDetails();
    setParentWallet(wallet);
  }, []);

  const handleAddTask = async(newTask: {
    title: string;
    description: string;
    child: string;
    reward: number;
    icon: string;
  }) => {
    // Find the child's name from the children array
    const child = children.find((c) => String(c.id) === newTask.child);
    if (!child) {
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `Child not found: ${newTask.child}`,
          type: "error",
        },
        ...notifications,
      ]);
      return;
    }

    // Blockchain interaction: createTask
    try {
      if (typeof window.ethereum === 'undefined') {
        setNotifications([
          { id: `notif-${Date.now()}`, message: 'Please install MetaMask', type: 'error' }, ...notifications ]);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        TASK_REGISTRY_ADDRESS,
        taskRegistryABI.output.abi,
        signer
      );
      const childWallet = child.walletAddress;
      const amount = ethers.parseEther(newTask.reward.toString());
      const tx = await contract.createTask(childWallet, amount, { value: amount });
      const receipt = await tx.wait();

      // Find TaskCreated event in logs
      let taskId: number | undefined;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          if (parsedLog && parsedLog.name === 'TaskCreated') {
            taskId = Number(parsedLog.args.taskId);
            break;
          }
        } catch {}
      }
      if (!taskId) {
        setNotifications([
          { id: `notif-${Date.now()}`, message: 'Could not extract taskId from contract event', type: 'error' }, ...notifications ]);
        return;
      }
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `Blockchain: Task created! Tx: ${tx.hash}, Task ID: ${taskId}`,
          type: "success",
        },
        ...notifications,
      ]);

      // Insert into Supabase using contract taskId
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            tid: taskId,
            id: newTask.child,
            title: newTask.title,
            description: newTask.description,
            reward: newTask.reward,
          },
        ])
        .select();
      if (error) {
        setNotifications([
          {
            id: `notif-${Date.now()}`,
            message: `Supabase error: ${error.message}`,
            type: "error",
          },
          ...notifications,
        ]);
        throw new Error(error.message);
      }
      if (!data || data.length === 0) {
        setNotifications([
          {
            id: `notif-${Date.now()}`,
            message: `No data returned from insert`,
            type: "error",
          },
          ...notifications,
        ]);
        throw new Error('No data returned from insert');
      }
      const taskWithId: Task = {
        ...newTask,
        child: child.name,
        id: `task-${taskId}`,
        tid: taskId,
        status: "pending",
      };
      setTasks([...tasks, taskWithId]);
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `New task "${newTask.title}" created for ${child.name}!`,
          type: "success",
        },
        ...notifications,
      ]);
    } catch (err: any) {
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `Blockchain error: ${err.message}`,
          type: "error",
        },
        ...notifications,
      ]);
      console.error('Blockchain error:', err);
    }
  }

  const handleAddChild = async (newChild: {
    name: string;
    age: number;
    password: string;
  }) => {
    try {
      if (!parentWallet) {
        throw new Error('Please connect your wallet first');
      }

      // Create a new ExSat wallet using ethers.js
      const wallet = ethers.Wallet.createRandom();
      const childWalletAddress = wallet.address;

      const { data, error } = await supabase
        .from('children')
        .insert([{
          child_name: newChild.name,
          age: newChild.age,
          parent_wallet: parentWallet,
          child_wallet: childWalletAddress,
          password: newChild.password
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error.message)
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert')
      }

      // Format and add the new child
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
          type: "success",
        },
        ...notifications,
      ])
    }
  }

  const handleUpdateTask = async(updatedTask: {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed" | "submitted" | "rejected";
    child: string;
    reward: number;
    icon: string;
  }) => {
    // Find the child's name from the children array
    const childName = children.find(child => child.id === updatedTask.child)?.name || updatedTask.child;

    setTasks(tasks.map((task) => 
      task.id === updatedTask.id 
        ? { ...task, ...updatedTask, child: childName }
        : task
    ))
  }

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
    setWalletAddress("")
  }

  const handleWalletConnect = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
      }

      // First, request account access and wait for user confirmation
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Check if we're already on the correct network
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      // If we're not on the correct network, try to switch
      if (chainId !== '0xCD13F') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xCD13F' }] // 839999 in hex
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            const addChainParams = {
              chainId: '0xCD13F', // 839999 in hex
              chainName: 'exSat Testnet',
              nativeCurrency: {
                name: 'exSat',
                symbol: 'BTC',
                decimals: 18
              },
              rpcUrls: ['https://evm-tst3.exsat.network'],
              blockExplorerUrls: ['https://scan-testnet.exsat.network']
            };

            // Request to add the network and wait for user confirmation
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [addChainParams]
            });

            // After adding, try switching again and wait for confirmation
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xCD13F' }] // 839999 in hex
            });
          } else {
            throw switchError;
          }
        }
      }

      // Only set connection state after all confirmations are complete
      setIsWalletConnected(true);
      setWalletAddress(accounts[0]);
      setParentWallet(accounts[0]);
      setShowConnectWallet(false);

      // Show success message
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: "Wallet connected to exSat Testnet successfully!",
          type: "success",
        },
        ...notifications,
      ]);
    } catch (error: any) {
      console.error('Error connecting wallet:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Reset connection state on error
      setIsWalletConnected(false);
      setWalletAddress("");
      
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: error.message || "Failed to connect wallet. Please try again.",
          type: "success",
        },
        ...notifications,
      ]);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const handleTaskReview = async (taskId: number, status: 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('tid', taskId)

      if (error) throw error

      // If approved, also call contract releaseTask
      if (status === 'completed') {
        try {
          if (typeof window.ethereum === 'undefined') {
            setNotifications([
              { id: `notif-${Date.now()}`, message: 'Please install MetaMask', type: 'success' }, ...notifications ]);
            return;
          }
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            TASK_REGISTRY_ADDRESS,
            taskRegistryABI.output.abi,
            signer
          );
          const tx = await contract.release(taskId);
          await tx.wait();
          setNotifications([
            {
              id: `notif-${Date.now()}`,
              message: `Blockchain: Task released! Tx: ${tx.hash}`,
              type: "success",
            },
            ...notifications,
          ]);
        } catch (err: any) {
          setNotifications([
            {
              id: `notif-${Date.now()}`,
              message: `Blockchain error: ${err.message}`,
              type: "success",
            },
            ...notifications,
          ]);
          console.error('Blockchain error:', err);
        }
      }

      // Update local state
      setTasks(tasks.map(task => 
        task.tid === taskId 
          ? { ...task, status }
          : task
      ))

      // Show success notification
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: `Task ${status === 'completed' ? 'approved' : 'rejected'} successfully!`,
          type: "success"
        },
        ...notifications
      ])
    } catch (error) {
      console.error('Error updating task:', error)
      setNotifications([
        {
          id: `notif-${Date.now()}`,
          message: 'Failed to update task status',
          type: "success"
        },
        ...notifications
      ])
    }
  }

  const filteredTasks = tasks.filter(task => {
    switch (activeTaskFilter) {
      case "pending":
        return task.status === "pending"
      case "completed":
        return task.status === "completed"
      case "review":
        return task.status === "submitted"
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-[#F5F5F5] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0zNiA0djRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bS04IDB2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tMzIgMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tMzIgMHY0aC00di00aDR6bTMyIDh2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHptLTggMHY0aC00di00aDR6bS04IDB2NGgtNHYtNGg0em0tOCAwdjRoLTR2LTRoNHoiIGZpbGw9IiNGOEM2RDIiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] font-sans">
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
        <div className="flex items-center gap-2">
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
            } text-[#4B5563] transition-all duration-300 shadow-sm`} onClick={() => handleWalletConnect()}>
            <Coins className="w-4 h-4 mr-2" />
            {isWalletConnected ? (
              <span className="font-mono text-xs">
                {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            ) : (
              "Connect"
            )}
          </Button>
          
          {isWalletConnected && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-sm"
              onClick={handleWalletDisconnect}
            >
              <span className="hidden sm:inline">Disconnect</span>
              <X className="w-4 h-4 sm:hidden" />
            </Button>
          )}
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
              <Home className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger
              value="children"
              className="data-[state=active]:bg-[#C9E4FF] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Users className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Children</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-[#C4E4D2] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Coins className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#D9CFF3] data-[state=active]:text-[#4B5563] rounded-lg"
            >
              <Clipboard className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-bold text-[#4B5563]">Tasks</h2>
              <Button
                className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563] shadow-sm transition-all duration-200 hover:shadow w-full sm:w-auto"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant="outline"
                className={`bg-white border-[#F8C6D2] text-[#4B5563] hover:bg-[#F8C6D2]/10 shadow-sm whitespace-nowrap ${
                  activeTaskFilter === "all" ? "bg-[#F8C6D2]/10" : ""
                }`}
                onClick={() => setActiveTaskFilter("all")}
              >
                All Tasks
              </Button>
              <Button
                variant="outline"
                className={`bg-white border-[#C4E4D2] text-[#4B5563] hover:bg-[#C4E4D2]/10 shadow-sm whitespace-nowrap ${
                  activeTaskFilter === "pending" ? "bg-[#C4E4D2]/10" : ""
                }`}
                onClick={() => setActiveTaskFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant="outline"
                className={`bg-white border-[#D9CFF3] text-[#4B5563] hover:bg-[#D9CFF3]/10 shadow-sm whitespace-nowrap ${
                  activeTaskFilter === "completed" ? "bg-[#D9CFF3]/10" : ""
                }`}
                onClick={() => setActiveTaskFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant="outline"
                className={`bg-white border-[#C9E4FF] text-[#4B5563] hover:bg-[#C9E4FF]/10 shadow-sm whitespace-nowrap ${
                  activeTaskFilter === "review" ? "bg-[#C9E4FF]/10" : ""
                }`}
                onClick={() => setActiveTaskFilter("review")}
              >
                Review
              </Button>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                  <Clipboard className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[#4B5563] font-medium mb-2">
                  {activeTaskFilter === "review" 
                    ? "No tasks to review" 
                    : activeTaskFilter === "completed"
                    ? "No completed tasks"
                    : activeTaskFilter === "pending"
                    ? "No pending tasks"
                    : "No tasks yet"}
                </h3>
                <p className="text-[#6B7280] text-sm mb-4">
                  {activeTaskFilter === "review"
                    ? "There are no tasks waiting for review"
                    : activeTaskFilter === "completed"
                    ? "Tasks will appear here once completed"
                    : activeTaskFilter === "pending"
                    ? "Tasks will appear here when assigned"
                    : "Create your first task to get started"}
                </p>
                {activeTaskFilter === "all" && (
                  <Button className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563]" onClick={() => setShowAddTask(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCardV2
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    child={task.child}
                    reward={task.reward}
                    icon={task.icon as "Broom" | "BookOpen" | "Bone"}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onReview={task.status === 'submitted' ? handleTaskReview : undefined}
                    tid={task.tid}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-bold text-[#4B5563]">Children</h2>
              <Button
                className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563] shadow-sm transition-all duration-200 hover:shadow w-full sm:w-auto"
                onClick={() => setShowAddChild(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </div>

            {children.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[#4B5563] font-medium mb-2">No children added yet</h3>
                <p className="text-[#6B7280] text-sm mb-4">
                  Add your children to start assigning tasks and tracking their progress
                </p>
                <Button className="bg-[#C9E4FF] hover:bg-[#B0D5F7] text-[#4B5563]" onClick={() => setShowAddChild(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {children.map((child) => (
                  <Card key={child.id} className="border-[#E5E7EB] bg-white shadow-sm hover:shadow transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#4B5563]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#4B5563]">{child.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-[#6B7280]">
                                Tasks Completed: {child.tasksCompleted}
                              </span>
                              <span className="text-xs text-[#6B7280]">
                                Total Rewards: {child.totalRewards} BTC
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="border-[#E5E7EB] text-[#4B5563] hover:border-[#C9E4FF]"
                          >
                            <Coins className="w-4 h-4 mr-2" />
                            View Wallet
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#4B5563]">Rewards</h2>
            </div>

            <div className="grid gap-4">
              {/* Total Rewards Card */}
              <Card className="border-[#E5E7EB] bg-white shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-[#6B7280]">Total Rewards Distributed</h3>
                      <p className="text-xl sm:text-2xl font-bold text-[#4B5563] mt-1">
                        {children.reduce((total, child) => total + child.totalRewards, 0)} BTC
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#C4E4D2]/30 rounded-full flex items-center justify-center">
                      <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-[#4B5563]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Children Rewards List */}
              {children.map((child) => (
                <Card key={child.id} className="border-[#E5E7EB] bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#4B5563]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#4B5563]">{child.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                            <span className="text-xs sm:text-sm text-[#6B7280]">
                              Tasks Completed: {child.tasksCompleted}
                            </span>
                            <span className="text-xs sm:text-sm text-[#6B7280]">
                              Rewards Earned: {child.totalRewards} BTC
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#4B5563] hover:border-[#C9E4FF] w-full sm:w-auto"
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          View Transactions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#4B5563]">Task History</h2>
            </div>

            <div className="grid gap-4">
              {tasks.filter(task => task.status === 'completed' || task.status === 'rejected').length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                  <div className="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                    <Clipboard className="w-8 h-8 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-[#4B5563] font-medium mb-2">No task history yet</h3>
                  <p className="text-[#6B7280] text-sm">
                    Completed and rejected tasks will appear here
                  </p>
                </div>
              ) : (
                tasks
                  .filter(task => task.status === 'completed' || task.status === 'rejected')
                  .map((task) => (
                    <Card key={task.id} className="border-[#E5E7EB] bg-white shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                              task.status === 'completed' ? 'bg-[#C4E4D2]/30' : 'bg-[#F8C6D2]/30'
                            }`}>
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#4B5563]" />
                              ) : (
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#4B5563]" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-[#4B5563]">{task.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                <span className="text-xs sm:text-sm text-[#6B7280]">
                                  Assigned to: {task.child}
                                </span>
                                <span className="text-xs sm:text-sm text-[#6B7280]">
                                  Reward: {task.reward} BTC
                                </span>
                                <Badge className={`${
                                  task.status === 'completed' 
                                    ? 'bg-[#C4E4D2] text-[#4B5563]' 
                                    : 'bg-[#F8C6D2] text-[#4B5563]'
                                }`}>
                                  {task.status === 'completed' ? 'Completed' : 'Rejected'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} onAddTask={handleAddTask} children={children} />
      )}

      {showAddChild && <AddChildModal onClose={() => setShowAddChild(false)} onAddChild={handleAddChild} />}

      {showConnectWallet && <ConnectWalletModal onClose={() => setShowConnectWallet(false)} onConnect={handleWalletConnect} />}
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
