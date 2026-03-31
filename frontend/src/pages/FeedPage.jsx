import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react'

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
    <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition">

      {/* AUTHOR */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-3">
          <img
            src={post.author?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=6366f1&color=fff`}
            className="w-10 h-10 rounded-full border border-white/20"
          />
          <div>
            <p className="text-sm font-semibold">{post.author?.name}</p>
            <p className="text-xs text-slate-400">
              {post.author?.role} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {(currentUser?._id === post.author?._id || currentUser?.role === 'admin') && (
          <button onClick={() => onDelete(post._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <p className="text-sm text-slate-300 whitespace-pre-wrap mb-3">{post.content}</p>

      {post.media && (
        <img src={post.media} className="rounded-xl max-h-80 w-full object-cover mb-3" />
      )}

      {/* ACTIONS */}
      <div className="flex gap-6 border-t border-white/10 pt-3 text-sm">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1 ${liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'} transition`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-slate-400 hover:text-purple-400 transition"
        >
          <MessageCircle size={16} />
          {post.comments?.length || 0}
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {post.comments?.map((c, i) => (
            <div key={i} className="flex gap-2">
              <img
                src={c.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || 'U')}&background=6366f1&color=fff`}
                className="w-7 h-7 rounded-full"
              />
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold">{c.user?.name}</p>
                <p className="text-xs text-slate-400">{c.text}</p>
              </div>
            </div>
          ))}

          {/* ADD COMMENT */}
          <form onSubmit={submitComment} className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              disabled={commenting}
              className="px-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center"
            >
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
    <div className="max-w-2xl mx-auto space-y-6 text-slate-200">

      <h1 className="text-2xl font-bold">News Feed</h1>

      {/* CREATE POST */}
      <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
        <form onSubmit={handlePost}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            className="w-full resize-none px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 min-h-[80px]"
          />

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm flex items-center gap-2"
            >
              {posting
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send size={14} /> Post</>}
            </button>
          </div>
        </form>
      </div>

      {/* POSTS */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          No posts yet. Be the first 🚀
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onDelete={handleDelete}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}

          {hasMore && (
            <button
              onClick={() => {
                const p = page + 1
                setPage(p)
                fetchPosts(p)
              }}
              className="w-full py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  )
}