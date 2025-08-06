import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Check, Clock, Edit, Trash2, Calendar, GripVertical } from 'lucide-react'

const TaskList = ({ tasks, onTaskToggle, onTaskEdit, onTaskDelete, onTasksReorder }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onTasksReorder(items)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first task to get started
        </p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`card p-6 transition-all duration-200 ${
                      snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                    } ${task.status === 'completed' ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Task Status Toggle */}
                      <button
                        onClick={() => onTaskToggle(task.id, task.status)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'completed' && <Check className="h-3 w-3" />}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-medium ${
                              task.status === 'completed'
                                ? 'line-through text-gray-500 dark:text-gray-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.title}
                            </h3>
                            
                            {task.description && (
                              <p className={`mt-1 text-sm ${
                                task.status === 'completed'
                                  ? 'line-through text-gray-400 dark:text-gray-500'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {task.description}
                              </p>
                            )}

                            {task.due_date && (
                              <div className={`mt-2 flex items-center text-sm ${
                                isOverdue(task.due_date)
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                <Calendar className="h-4 w-4 mr-1" />
                                Due: {formatDate(task.due_date)}
                                {isOverdue(task.due_date) && (
                                  <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs rounded-full">
                                    Overdue
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Task Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => onTaskEdit(task)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="Edit task"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onTaskDelete(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                              title="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TaskList