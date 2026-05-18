import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { 
  getWishlistItems, 
  addWishlistItem, 
  updateWishlistItem, 
  toggleWishlistItem, 
  deleteWishlistItem,
  WishlistItem 
} from '../lib/database';

interface WishlistProps {
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onLogoutClick, onNavigate }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load wishlist from database on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWishlistItems();
      setItems(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!title.trim()) {
      setError('Please enter a wish title');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        // Update existing item
        const updated = await updateWishlistItem(editingId, {
          title: title.trim(),
          description: description.trim(),
          link: link.trim() || undefined,
          priority,
        });
        
        if (updated) {
          setItems(items.map(item => item.id === editingId ? updated : item));
          setEditingId(null);
        } else {
          setError('Failed to update wish');
        }
      } else {
        // Add new item
        const newItem = await addWishlistItem({
          title: title.trim(),
          description: description.trim(),
          link: link.trim() || undefined,
          priority,
        });
        
        if (newItem) {
          setItems([newItem, ...items]);
        } else {
          setError('Failed to add wish');
        }
      }

      // Clear form
      setTitle('');
      setDescription('');
      setLink('');
      setPriority('medium');
    } catch (err) {
      console.error('Error saving wish:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editItem = (item: WishlistItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setLink(item.link || '');
    setPriority(item.priority);
    setError('');
  };

  const deleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      setError('');
      try {
        const success = await deleteWishlistItem(id);
        if (success) {
          setItems(items.filter((item) => item.id !== id));
          if (editingId === id) {
            cancelEdit();
          }
        } else {
          setError('Failed to delete wish');
        }
      } catch (err) {
        console.error('Error deleting wish:', err);
        setError('An error occurred. Please try again.');
      }
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      const updated = await toggleWishlistItem(id, !completed);
      if (updated) {
        setItems(items.map(item => item.id === id ? updated : item));
      } else {
        setError('Failed to update wish status');
      }
    } catch (err) {
      console.error('Error toggling wish:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setLink('');
    setPriority('medium');
    setError('');
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  };

  const priorityEmojis = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  return (
    <>
      <Navbar currentPage="wishlist" onLogoutClick={onLogoutClick} onNavigate={onNavigate} />
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 pt-20 pb-12 px-4">
        {/* Animated background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '4s' }}></div>
          
          {/* Floating hearts */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300/40 animate-float-heart select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 8 + 6}s`,
              }}
            >
              ♡
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 animate-bounce-slow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">💝</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-xl animate-sparkle">✨</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent mb-2 animate-gradient-x">
              Your Wishlist
            </h1>
            <p className="text-rose-400 text-sm md:text-base font-medium">
              {loading ? 'Loading your wishes...' : `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} • ${items.filter((i) => i.completed).length} completed`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl animate-slide-in">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-900">✕</button>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-white/40 animate-slide-up">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-t-3xl"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
              {editingId ? '✏️ Edit Your Wish' : '➕ Add a New Wish'}
            </h2>

            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wish Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What do you wish for? ✨"
                  className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell me more about your wish... 💭"
                  className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 h-24 resize-none transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com 🔗"
                  className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Priority & Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                <button
                  onClick={addItem}
                  disabled={isSubmitting || !title.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-pink-400/40 transition-all duration-300 hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>{editingId ? '💾 Update Wish' : '🎀 Add Wish'}</span>
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-98 disabled:opacity-50"
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6 justify-center flex-wrap">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white'
                }`}
              >
                {f === 'all' && '📋 All Wishes'}
                {f === 'active' && '⏳ Active'}
                {f === 'completed' && '✓ Completed'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center">
              <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-pink-600 text-lg font-semibold">Loading your wishes...</p>
            </div>
          )}

          {/* Wishlist Items */}
          {!loading && (
            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/40">
                  <div className="text-6xl mb-4 animate-bounce-slow">💭</div>
                  <p className="text-2xl font-semibold text-gray-700 mb-2">
                    {filter === 'all' && 'No wishes yet! Add your first wish above.'}
                    {filter === 'active' && '✨ All wishes completed! You\'re amazing!'}
                    {filter === 'completed' && '📝 No completed wishes yet.'}
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 transition-all duration-300 hover:shadow-xl animate-slide-up ${
                      item.completed ? 'opacity-75' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(item.id, item.completed)}
                        className="flex-shrink-0 self-start"
                        disabled={isSubmitting}
                      >
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            item.completed
                              ? 'bg-green-500 border-green-500 shadow-lg'
                              : 'border-gray-300 hover:border-pink-500 hover:scale-110'
                          }`}
                        >
                          {item.completed && <span className="text-white text-sm">✓</span>}
                        </div>
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3
                            className={`text-lg md:text-xl font-bold ${
                              item.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-800'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${priorityColors[item.priority]}`}>
                            {priorityEmojis[item.priority]} {item.priority}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-gray-600 mb-2">{item.description}</p>
                        )}

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors"
                          >
                            🔗 View Link →
                          </a>
                        )}

                        <p className="text-xs text-gray-400 mt-3">
                          Added {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 self-end sm:self-start">
                        <button
                          onClick={() => editItem(item)}
                          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all hover:scale-105"
                          disabled={isSubmitting}
                          title="Edit wish"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all hover:scale-105"
                          disabled={isSubmitting}
                          title="Delete wish"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
        }
        
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.3) rotate(10deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-heart {
          animation: float-heart linear infinite;
        }
        
        .animate-blob-slow {
          animation: blob-slow 12s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default Wishlist;