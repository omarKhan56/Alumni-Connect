import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Send, Trash2, Image, MoreHorizontal } from 'lucide-react'

function PostCard({ post, currentUser, onDelete, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commenting, setCommenting] = useState(false)
  const liked = post.likes?.includes(currentUser?._id)

  const submitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommenting(true)
    try {
      await onComment(post._id, commentText)
      setCommentText('')
    } finally {
      setCommenting(false)
    }
  }

  return (
    <div className="card animate-slide-up">
      {/* Author */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=6366f1&color=fff`}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-800 text-sm">{post.author?.name}</p>
            <div className="flex items-center gap-2">
              <span className={`badge text-xs ${post.author?.role === 'alumni' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                {post.author?.role}
              </span>
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        {(currentUser?._id === post.author?._id || currentUser?.role === 'admin') && (
          <button onClick={() => onDelete(post._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>
      {post.media && (
        <img src={post.media} alt="Post media" className="w-full rounded-xl object-cover max-h-80 mb-3" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          {post.likes?.length || 0}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-brand-500 transition-colors"
        >
          <MessageCircle size={16} />
          {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {post.comments?.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <img
                src={c.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || 'U')}&background=e0e7ff&color=4f46e5&size=32`}
                alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-slate-700">{c.user?.name}</p>
                <p className="text-xs text-slate-600 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex items-center gap-2 mt-2">
            <img
              src={currentUser?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=6366f1&color=fff&size=28`}
              alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
            <input
              value={commentText} onChange={(e) => setCommentText(e.target.value)}
              className="input py-1.5 text-sm flex-1" placeholder="Add a comment…" required
            />
            <button type="submit" disabled={commenting} className="p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function FeedPage() {
  const { user } = useSelector((s) => s.auth)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (p = 1, reset = false) => {
    try {
      const { data } = await api.get(`/posts?page=${p}&limit=10`)
      setPosts(prev => reset ? data.posts : [...prev, ...data.posts])
      setHasMore(p < data.pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts(1, true) }, [])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    try {
      const { data } = await api.post('/posts', { content })
      setPosts(prev => [data, ...prev])
      setContent('')
      toast.success('Post published!')
    } catch {
      toast.error('Failed to post')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const { data } = await api.put(`/posts/${postId}/like`)
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p))
    } catch { toast.error('Failed to like') }
  }

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`)
      setPosts(prev => prev.filter(p => p._id !== postId))
      toast.success('Post deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleComment = async (postId, text) => {
    const { data } = await api.post(`/posts/${postId}/comment`, { text })
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, comments: data } : p))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-slate-800">News Feed</h1>

      {/* Create post */}
      <div className="card">
        <form onSubmit={handlePost}>
          <div className="flex items-start gap-3">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
              alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none input py-2.5 text-sm min-h-[80px]"
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            />
          </div>
          <div className="flex items-center justify-end mt-3">
            <button type="submit" className="btn-primary" disabled={posting || !content.trim()}>
              {posting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Post</>}
            </button>
          </div>
        </form>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="w-32 h-3 bg-slate-200 rounded" />
                  <div className="w-20 h-2.5 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post._id} post={post} currentUser={user}
              onDelete={handleDelete} onLike={handleLike} onComment={handleComment}
            />
          ))}
          {hasMore && (
            <button
              onClick={() => { const p = page + 1; setPage(p); fetchPosts(p) }}
              className="btn-secondary w-full justify-center"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  )
}
