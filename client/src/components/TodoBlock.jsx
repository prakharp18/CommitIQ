import { useState, useEffect } from 'react'
import { Plus, Check, X, CheckCircle2, Circle } from 'lucide-react'

const TodoBlock = () => {
  // Load todos from localStorage on mount
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('commitiq-todos')
    if (savedTodos) {
      return JSON.parse(savedTodos)
    }
    return [
      { id: 1, text: 'Review pull requests', completed: false },
      { id: 2, text: 'Update documentation', completed: true },
      { id: 3, text: 'Deploy new features', completed: false },
      { id: 4, text: 'Team standup meeting', completed: true }
    ]
  })
  
  const [newTodo, setNewTodo] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('commitiq-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }])
      setNewTodo('')
      setIsAdding(false)
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-white">Quick Tasks</h4>
          <p className="text-xs text-gray-400">
            {completedCount}/{totalCount} completed
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 rounded-full h-1.5 mb-3">
        <div
          className="bg-white h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        ></div>
      </div>

      {/* Add New Todo */}
      {isAdding && (
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 text-white rounded focus:outline-none focus:ring-1 focus:ring-white"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            autoFocus
          />
          <button
            onClick={addTodo}
            className="p-1 text-white hover:text-gray-300"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewTodo('')
            }}
            className="p-1 text-gray-400 hover:text-gray-300"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Todo List - Compact with scrollbar */}
      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: isAdding ? '60px' : '80px' }}>
        <div className="space-y-1">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center space-x-2 group py-1 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0"
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : (
                  <Circle className="h-3 w-3 text-gray-500 hover:text-white" />
                )}
              </button>
              <span
                className={`flex-1 text-xs ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-2 w-2 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="flex items-center justify-center text-gray-400 h-16">
            <div className="text-center">
              <Circle className="h-4 w-4 mx-auto mb-1 opacity-50" />
              <p className="text-xs">No tasks yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoBlock