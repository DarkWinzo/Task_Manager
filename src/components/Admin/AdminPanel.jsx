import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Users, CheckSquare, Calendar, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../UI/ThemeToggle'
import axios from 'axios'

const AdminPanel = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/tasks')
      ])
      setUsers(usersResponse.data)
      setAllTasks(tasksResponse.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their tasks?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`)
        setUsers(users.filter(u => u.id !== userId))
        setAllTasks(allTasks.filter(t => t.user_id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/admin/tasks/${taskId}`)
        setAllTasks(allTasks.filter(t => t.id !== taskId))
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const getUserTasks = (userId) => {
    return allTasks.filter(task => task.user_id === userId)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{allTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allTasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Users</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => {
                const userTasks = getUserTasks(user.id)
                return (
                  <div key={user.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{userTasks.length} tasks</span>
                          <span>{userTasks.filter(t => t.status === 'completed').length} completed</span>
                          <span>Joined {formatDate(user.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                          className="btn-secondary text-sm"
                        >
                          {selectedUser === user.id ? 'Hide Tasks' : 'View Tasks'}
                        </button>
                        {user.email !== 'DarkWinzo@gmail.com' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {selectedUser === user.id && (
                      <div className="mt-4 space-y-2">
                        {userTasks.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found</p>
                        ) : (
                          userTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  task.status === 'completed'
                                    ? 'line-through text-gray-500 dark:text-gray-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Status: {task.status} | Created: {formatDate(task.created_at)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {allTasks
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 20)
                .map(task => {
                  const taskUser = users.find(u => u.id === task.user_id)
                  return (
                    <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            task.status === 'completed'
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {taskUser?.name} | {formatDate(task.created_at)}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel