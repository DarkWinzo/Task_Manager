import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut, Plus, Settings, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../UI/ThemeToggle'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import TaskFilters from './TaskFilters'
import axios from 'axios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, filter])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks
    if (filter === 'completed') {
      filtered = tasks.filter(task => task.status === 'completed')
    } else if (filter === 'pending') {
      filtered = tasks.filter(task => task.status === 'pending')
    }
    setFilteredTasks(filtered)
  }

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const response = await axios.put(`/api/tasks/${editingTask.id}`, taskData)
        setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task))
      } else {
        const response = await axios.post('/api/tasks', taskData)
        setTasks([...tasks, response.data])
      }
      setShowTaskForm(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleTaskToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const response = await axios.put(`/api/tasks/${taskId}`, { status: newStatus })
      setTasks(tasks.map(task => task.id === taskId ? response.data : task))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTasksReorder = async (reorderedTasks) => {
    setTasks(reorderedTasks)
    // Update order in backend if needed
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Task Manager
              </h1>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {user?.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user?.email === 'DarkWinzo@gmail.com' && (
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              )}
              
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Tasks
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your tasks efficiently
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingTask(null)
              setShowTaskForm(true)
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              taskCounts={{
                all: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                completed: tasks.filter(t => t.status === 'completed').length
              }}
            />
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <TaskList
              tasks={filteredTasks}
              onTaskToggle={handleTaskToggle}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleTaskDelete}
              onTasksReorder={handleTasksReorder}
            />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard