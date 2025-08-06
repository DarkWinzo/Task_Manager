import React from 'react'
import { List, Clock, CheckCircle } from 'lucide-react'

const TaskFilters = ({ filter, onFilterChange, taskCounts }) => {
  const filters = [
    {
      key: 'all',
      label: 'All Tasks',
      icon: List,
      count: taskCounts.all,
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: Clock,
      count: taskCounts.pending,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: taskCounts.completed,
      color: 'text-green-600 dark:text-green-400'
    }
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filter Tasks
      </h3>
      
      <div className="space-y-2">
        {filters.map(({ key, label, icon: Icon, count, color }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
              filter === key
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 mr-3 ${filter === key ? 'text-primary-600 dark:text-primary-400' : color}`} />
              <span className="font-medium">{label}</span>
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              filter === key
                ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFilters