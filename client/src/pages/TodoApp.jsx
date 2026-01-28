import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Pencil, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const { logout } = useAuth();

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/todos');
      setTodos(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        logout(); // Auto logout if token is invalid
      }
      setError('Failed to fetch todos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await api.post('/todos', { title: newTodoTitle });
      setTodos([response.data, ...todos]);
      setNewTodoTitle('');
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  // Toggle complete
  const handleToggleComplete = async (todo) => {
    try {
      const response = await api.patch(`/todos/${todo._id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t._id === todo._id ? response.data : t));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const response = await api.patch(`/todos/${id}`, {
        title: editTitle
      });
      setTodos(todos.map(t => t._id === id ? response.data : t));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update todo title');
      console.error(err);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Todos</h1>
          <button
            onClick={logout}
            className="text-white hover:text-indigo-200 transition-colors flex items-center gap-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                <X className="h-5 w-5" />
              </span>
            </div>
          )}

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newTodoTitle.trim()}
              className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Plus size={24} />
            </button>
          </form>

          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li key={todo._id} className={`flex items-center justify-between p-3 rounded-md border ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                  {editingId === todo._id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(todo._id)} className="text-green-600 hover:text-green-800">
                        <Save size={18} />
                      </button>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <button
                          onClick={() => handleToggleComplete(todo)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          {todo.completed && <Check size={14} className="text-white" />}
                        </button>
                        <span className={`truncate ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {todo.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
